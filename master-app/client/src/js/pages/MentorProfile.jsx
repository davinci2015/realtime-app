import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

// Local
import helper from '../utils/helpers';
import apiUsers from '../services/api/apiUsers';
import apiAuth from '../services/api/apiAuth';
import constants from '../utils/constants';
import SseHandler from '../services/sseHandler';
import storage from '../utils/sessionStorage';
import generateId from 'uuid/v1';

// Components
import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import PowerIcon from 'material-ui/svg-icons/action/power-settings-new';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class MentorProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            modalOpen: false
        }
    }

    _handleCallRequest(message) {
        if (message.callRequestType === constants.callRequestType.REQUEST) {
            this.setState({
                modalOpen: true,
                requestSenderId: message.senderId,
                requestSenderName: message.senderName
            });
        }
    }

    componentDidMount() {
        this._sse = new SseHandler({
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
                    name: constants.sseMessageType.CALL,
                    handler: message => this._handleCallRequest(message)
                }
            ]
        });
    }

    componentWillUnmount() {
        this._sse.closeConnection();
    }

    _generateKnowledge = knowledge => knowledge.map((item, index) => <li key={index}>{item}</li>);

    _toggleOnlineStatus(mentorId) {
        apiUsers.toggleOnlineStatus(mentorId)
            .then(result => {
                const user = this.state.user;
                user.online = result.online;
                this.setState({ user });
            })
            .catch(error => {
                // Handle error
            });
    }

    _logout(userId) {
        apiAuth.logout(userId)
            .then(() => {
                storage.removeMultiple([constants.storageKeys.USER_DATA, constants.storageKeys.USER_TOKEN]);
                this.setState({ redirectTo: constants.routes.ROOT });
            })
            .catch(error => console.log(error));
    }

    _respondToCallRequest(callRequestType) {
        let channelId;

        if (callRequestType === constants.callRequestType.DECLINE) {
            this.setState({ modalOpen: false });
        } else if (callRequestType === constants.callRequestType.ACCEPT) {
            channelId = generateId();
            const panelUrl = `${constants.routes.PANEL}/${channelId}`
            this.setState({ redirectTo: panelUrl });
        }

        // Notify caller
        apiUsers.processCall({
            senderName: `${this.state.user.name} ${this.state.user.surname}`,
            senderId: this.state.user._id,
            recipientId: this.state.requestSenderId,
            callRequestType,
            channelId
        });
    }

    _getColorForRatingText(rating) {
        const maxRating = 5;
        return helper.getColorFromRedToGreen(rating / maxRating);
    }

    render() {
        const { user } = this.state;
        if (this.state.redirectTo) {
            return <Redirect to={{pathname: this.state.redirectTo}}/>;
        }

        const styles = {
            paper: {
                padding: '30px',
                borderRadius: '6px'
            },
            switchLabel: {
                width: 'auto'
            }
        };

        const actions = [
            <FlatButton
                label="Cancel"
                primary
                onTouchTap={() => this._respondToCallRequest(constants.callRequestType.DECLINE)}
            />,
            <FlatButton
                label="Accept call"
                primary
                keyboardFocused
                onTouchTap={() => this._respondToCallRequest(constants.callRequestType.ACCEPT)}
            />
        ];

        const mentorRating = helper.calculateAverage(user.ratings).toFixed(2);

        return (
            <div>
                <Dialog
                    title="Education call"
                    actions={actions}
                    modal={false}
                    open={this.state.modalOpen}
                    onRequestClose={() => this._respondToCallRequest(constants.callRequestType.DECLINE)}>
                    {this.state.requestSenderName} is calling you!
                </Dialog>

                <AppBar
                    title="Education App"
                    iconElementRight={
                        <IconButton onTouchTap={() => this._logout(user._id)}>
                            <PowerIcon/>
                        </IconButton>
                    }
                    showMenuIconButton={false}
                />

                <div className="mentor-profile">
                    <Paper zDepth={2} style={styles.paper}>
                        <div className="mentor-profile__header header">
                            <div className="header__left">
                                <span className="header__name">{`${user.name} ${user.surname}`}</span>
                                <span className="header__profession">{user.profession}</span>
                            </div>
                            <div className="header__right">
                                <Toggle
                                    label="Available"
                                    defaultToggled={user.online}
                                    labelStyle={styles.switchLabel}
                                    onToggle={() => this._toggleOnlineStatus(user._id)}
                                />
                            </div>
                        </div>
                        <span style={{ color: this._getColorForRatingText(mentorRating)}} className="mentor-profile__rating">Rating: {mentorRating}</span>
                        <p className="mentor-profile__about">{user.about}</p>
                        <ul>
                            {this._generateKnowledge(user.knowledge)}
                        </ul>
                    </Paper>
                </div>
            </div>
        );
    }
}

export default MentorProfile;
