import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

// Local
import constants from '../utils/constants';
import storage from '../utils/sessionStorage';
import SSEHandler from '../services/sseHandler';
import apiUsers from '../services/api/apiUsers';
import apiAuth from '../services/api/apiAuth';

// Components
import MentorCard from '../components/MentorCard.jsx';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import PowerIcon from 'material-ui/svg-icons/action/power-settings-new';

class MentorList extends Component {
    constructor(props) {
        super(props);
        this._requestCall = this._requestCall.bind(this);
        this.state = {
            user: this.props.user,
            loadingMentors: true,
            mentors: null,
            modalOpen: false,
            snackbar: {
                open: false,
                message: ''
            }
        };
    }

    componentWillMount() {
        const hasPendingFeedbackRequests = !!this.props.user.feedbackRequests.length;
        if (hasPendingFeedbackRequests) {
            this.setState({ redirectTo: constants.routes.RATING });
        } else {
            this._setupSseHandler();
            this._getMentors();
        }
    }

    componentWillUnmount() {
        if (this._sse) {
            this._sse.closeConnection();
        }
    }

    _getMentors() {
        apiUsers.getMentors()
            .then(mentors => this.setState({mentors, loadingMentors: false}))
            .catch(error => console.log(error));
    }

    _handlerMentorStatusUpdate(message) {
        this._updateMentorStatus(message.mentorID, message.online)
        this._showSnackBar(`${message.name} ${message.surname} is ${message.online ? 'online' : 'offline'}`);
    }

    _handleDeclinedCall(senderName) {
        this.setState({modalOpen: false});
        this._showSnackBar(`${senderName} rejected call :(`);
    }

    _handleAcceptedCall(channelId, senderId) {
        const panelUrl = `${constants.routes.PANEL}/${channelId}`;
        apiUsers.requestFeedback({userId: this.state.user._id, mentorId: senderId})
            .then(() => this.setState({redirectTo: panelUrl}))
            .catch(error => console.log(error));
    }

    _handleCallRequestType(message) {
        if (message.callRequestType === constants.callRequestType.DECLINE) {
            this._handleDeclinedCall(message.senderName);
        } else if (message.callRequestType === constants.callRequestType.ACCEPT) {
            this._handleAcceptedCall(message.channelId, message.senderId);
        }
    }

    _setupSseHandler() {
        // Setup SSE handler
        this._sse = new SSEHandler({
            id: this.state.user._id,
            onMessage: function (message) {
                console.log(message);
            },
            onError: function (error) {
                console.log(error);
            },
            onOpen: function (message) {
                console.log(message);
            },
            customEvents: [
                {
                    name: constants.sseMessageType.MENTOR_STATUS,
                    handler: message => this._handlerMentorStatusUpdate(message)
                },
                {
                    name: constants.sseMessageType.CALL,
                    handler: message => this._handleCallRequestType(message)
                }
            ]
        });
    }

    /**
     * Show snackbar with message
     * @param message {String}
     * @private
     */
    _showSnackBar(message) {
        this.setState({
            snackbar: {
                open: true,
                message
            }
        });
    };

    /**
     * Update mentor online status
     * @param mentorID {Number}
     * @param online {Boolean} true if mentor is online
     * @private
     */
    _updateMentorStatus(mentorID, online) {
        if (!this.state.mentors) return;
        const mentors = this.state.mentors;
        for (let i = 0; i < mentors.length; i++) {
            if (mentors[i]._id === mentorID) {
                // Update online status
                mentors[i].online = online;
                // Update state
                this.setState({mentors});
            }
        }
    }

    /**
     * Generate mentor cards
     * @param mentors {Array} - array of mentor objects
     * @param mentors[].name {String}
     * @param mentors[].surname {String}
     * @param mentors[].online {Boolean}
     * @param mentors[].profession {String}
     * @param mentors[].knowledge {Array} - array of strings
     * @param mentors[].rating {Array} - array of numbers
     * @private
     */
    _generateMentorCards(mentors) {
        return mentors.map((mentor, index) => (
            <div className="mentor-list__card" key={index}>
                <MentorCard onCall={this._requestCall} mentor={mentor}/>
            </div>
        ));
    }

    _requestCall(recipientId) {
        apiUsers.processCall({
            senderId: this.state.user._id,
            senderName: `${this.state.user.name} ${this.state.user.surname}`,
            callRequestType: constants.callRequestType.REQUEST,
            recipientId
        })
            .then(() => {
                // Show modal
                this.setState({
                    modalOpen: true,
                    snackbar: {
                        open: false,
                        message: ''
                    }
                });
            })
            .catch(error => console.log(error));
    }

    _closeModal() {
        this.setState({modalOpen: false});
    }

    _logout(userId) {
        apiAuth.logout(userId)
            .then(() => {
                storage.removeMultiple([constants.storageKeys.USER_DATA, constants.storageKeys.USER_TOKEN]);
                this.setState({redirectTo: constants.routes.ROOT});
            })
            .catch(error => console.log(error));
    }

    render() {
        if (!this.state.user) return <Redirect to={{pathname: constants.routes.LOGIN}}/>;
        if (this.state.redirectTo) return <Redirect to={{pathname: this.state.redirectTo}}/>;
        if (this.state.loadingMentors) return null;

        const actions = [
            <FlatButton
                label="Close"
                primary
                onTouchTap={() => this._closeModal()}
            />
        ];

        return (
            <div>
                <Dialog
                    title="Education call"
                    actions={actions}
                    modal={false}
                    open={this.state.modalOpen}
                    onRequestClose={() => this._closeModal()}>
                    Waiting for mentor to respond...
                </Dialog>

                <AppBar
                    title="Education App"
                    iconElementRight={
                        <IconButton onTouchTap={() => this._logout(this.state.user._id)}>
                            <PowerIcon/>
                        </IconButton>
                    }
                    showMenuIconButton={false}/>

                <div className="mentor-list">
                    <Snackbar
                        open={this.state.snackbar.open}
                        message={this.state.snackbar.message}
                        autoHideDuration={4000}/>
                    {this._generateMentorCards(this.state.mentors)}
                </div>
            </div>
        );
    }
}

export default MentorList;
