import React, {Component} from 'react';
import _ from 'lodash';
import {Redirect} from 'react-router-dom';

// Local
import Canvas from '../utils/canvas';
import WsHandler from '../services/wsHandler';
import peerHandler from '../services/peerHandler';
import config from '../config';
import constants from '../utils/constants';

// Components
import Chip from 'material-ui/Chip';
import SvgIconFace from 'material-ui/svg-icons/action/face';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import CallEndIcon from 'material-ui/svg-icons/communication/call-end';

// Components
import Snackbar from 'material-ui/Snackbar';

class Panel extends Component {
    constructor() {
        super();
        this._onReceiveStream = this._onReceiveStream.bind(this);
        this._rtcPeers = new Map();
        this._mentorStream = null;
        this.state = {
            participants: [],
            snackbar: {
                open: false,
                message: ''
            }
        }
    }

    componentDidMount() {
        this.video = this.refs.video;
        this._canvas = new Canvas(this.refs.panel);
        this._canvas.setCanvasSize(config.panel.width, config.panel.height);
        this._attachEvents();
        this._scrollToCenter(this._canvas.getCanvasSize());
        this._setupWsHandler();
        this._setupPeerHandler();
    }

    _startPeerConnections(participants) {
        if (!this._mentorStream) {
            peerHandler.getAudio()
                .then(stream => {
                    this._mentorStream = stream;
                    this._connectToPeers(participants, stream);
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            this._connectToPeers(participants, this._mentorStream);
        }
    }

    _connectToPeers(participants, stream) {
        participants.forEach(participant => {
            if (participant._id === this.props.user._id) return;
            // Create connection to peer if it's not already connected
            if (!this._rtcPeers.has(participant._id)) {
                const connection = this._peer.call(participant._id, stream);
                this._rtcPeers.set(participant._id, connection);
                connection.on('stream', this._onReceiveStream);
            }
        });
    }

    _setupWsHandler() {
        const self = this;
        const channelId = this.props.computedMatch.params.channelId;
        this._socket = new WsHandler(`${config.wsUrl}?channelId=${channelId}`);
        this._socket.attachHandlers({
            onOpen: function () {
                const participant = _.pick(self.props.user, ['_id', 'name', 'surname', 'email']);
                self._socket.sendMessage({
                    messageType: constants.socketMessageType.AUTHENTICATION,
                    authentication: participant
                });
            },
            onMessage: function (error, message) {
                if (error) {
                    console.log('Error while receiving socket message:', error);
                    return;
                }

                // Handle authentication message
                if (message.messageType === constants.socketMessageType.AUTHENTICATION) {
                    self.setState({participants: message.participants});
                    if (self.props.user.userType === constants.userTypes.MENTOR) {
                        // Connect mentor peer with other student peers
                        self._startPeerConnections(message.participants);
                    }
                } else if (message.messageType === constants.socketMessageType.DRAWING) {
                    // Handle draw message
                    switch (message.drawAction) {
                        case constants.drawActions.start:
                            self._canvas.startDrawing(message.coordinates.x, message.coordinates.y);
                            break;
                        case constants.drawActions.draw:
                            self._canvas.draw(message.coordinates.x, message.coordinates.y);
                            break;
                        default:
                            return;
                    }
                } else if (message.messageType === constants.socketMessageType.CONNECTION_CLOSED) {
                    const participantLeft = message.user;
                    // Filter out participant that left conversation
                    const activeParticipants = self.state.participants
                        .filter(participant => participant._id !== participantLeft._id);
                    // Close peer connection
                    if (self._rtcPeers.has(participantLeft._id)) {
                        self._rtcPeers.get(participantLeft._id).close();
                    }

                    self.setState({
                        participants: activeParticipants,
                        snackbar: {
                            open: true,
                            message: `${participantLeft.name} ${participantLeft.surname} left conversation`
                        }
                    });
                }
            }
        });
    }

    _onReceiveStream(stream) {
        this.video.src = window.URL.createObjectURL(stream);
        this.video.onloadedmetadata = () => {
            console.log('Now playing the video');
            this.video.play();
        }
    }

    _setupPeerHandler() {
        const self = this;

        this._peer = new window.Peer(this.props.user._id, {key: 'p445zce83gjmunmi'});
        this._peer.on('open', function (id) {
            console.log('My peer ID is: ' + id);
        });

        // Receive connection
        this._peer.on('call', function (connection) {
            console.log('Peer is calling...');
            connection.on('stream', self._onReceiveStream);
            peerHandler.getAudio()
                .then(stream => {
                    console.log('Peer answered to call');
                    connection.answer(stream);
                })
                .catch(error => {
                    console.log('Something went wrong while connecting peers');
                    console.log(error);
                });
        });
    }

    _getMouseCoordinates(e) {
        return {
            x: e.clientX + window.scrollX,
            y: e.clientY + window.scrollY
        }
    }

    _attachEvents() {
        const canvasElement = this._canvas.getCanvasElement();
        let isMouseMoving = false;
        // Event handler when user click mouse
        canvasElement.addEventListener('mousedown', (e) => {
            isMouseMoving = true;
            const coordinates = this._getMouseCoordinates(e);
            this._canvas.startDrawing(coordinates.x, coordinates.y);
            this._socket.sendMessage({
                messageType: constants.socketMessageType.DRAWING,
                drawAction: constants.drawActions.start,
                coordinates
            });
        });

        // Event handler when user is moving mouse
        canvasElement.addEventListener('mousemove', (e) => {
            if (isMouseMoving) {
                const coordinates = this._getMouseCoordinates(e);
                this._canvas.draw(coordinates.x, coordinates.y);
                this._socket.sendMessage({
                    messageType: constants.socketMessageType.DRAWING,
                    drawAction: constants.drawActions.draw,
                    coordinates
                });
            }
        });

        // Event handler when user stops with mouse click
        canvasElement.addEventListener('mouseup', (e) => {
            isMouseMoving = false;
            const coordinates = this._getMouseCoordinates(e);
            this._socket.sendMessage({
                messageType: constants.socketMessageType.DRAWING,
                drawAction: constants.drawActions.stop,
                coordinates
            });
        });
    }

    /**
     * Scroll at center of page
     * @param containerSize {Object}
     * @param containerSize.height {Number}
     * @param containerSize.width {Number}
     * @private
     */
    _scrollToCenter(containerSize) {
        const scrollX = (containerSize.width - window.innerWidth) / 2;
        const scrollY = (containerSize.height - window.innerHeight) / 2;
        setTimeout(function () {
            window.scrollTo(scrollX, scrollY);
        }, 0); // Push scroll function to end of stack
    }

    _renderParticipants() {
        if (!this.state.participants.length) return null;
        return this.state.participants.map((participant, index) => {
            if (!participant) return null;
            return (
                <Chip className="panel__chip" key={index} style={{top: (index * 40) + 15}}>
                    <Avatar icon={<SvgIconFace/>}/>
                    {participant.name} {participant.surname}
                </Chip>
            )
        });
    }

    _hangUp() {
        this._socket.closeSocket();
        this._peer.disconnect();
        for (let peer of this._rtcPeers.values()) peer.close();
        const redirectTo = this.props.user.userType === constants.userTypes.MENTOR ?
            constants.routes.MENTOR_PROFILE :
            constants.routes.MENTORSHIP;
        this.setState({ redirectTo });
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={{pathname: this.state.redirectTo}}/>;

        return (
            <div className="panel" style={config.panel}>
                <Snackbar
                    open={this.state.snackbar.open}
                    message={this.state.snackbar.message}
                    autoHideDuration={4000}/>
                {this._renderParticipants()}
                <RaisedButton
                    secondary
                    label="End call"
                    className="panel__call-end"
                    onTouchTap={() => this._hangUp()}
                    icon={<CallEndIcon/>}/>
                <canvas ref="panel"></canvas>
                <video className="panel__video" ref="video" autoPlay></video>
                <div id="panel-center"></div>
            </div>
        );
    }
}

export default Panel;
