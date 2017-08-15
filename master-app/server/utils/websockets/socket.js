const url = require('url');
const WebSocket = require('ws');
const channelManagement = require('./channelManagement');
const constants = require('../constants');

class Socket {
    /**
     * Http server
     * @param server
     */
    constructor(server) {
        this._wss = new WebSocket.Server({server});
        this._initialize();
    }

    sendMessage(message, ws) {
        ws.send(JSON.stringify(message));
    }

    _sendMessageToOthers(message, channelId, mySocket) {
        const channelParticipants = channelManagement.getChannelParticipants(channelId);
        // Broadcast message to all other channel participants
        channelParticipants.forEach(participant => {
            // Send message to other participants that have open socket connection
            if (participant !== mySocket && participant.readyState === WebSocket.OPEN) {
                this.sendMessage(message, participant);
            }
        });
    }

    _sendMessageToEveryone(message, participants) {
        // Broadcast message to all participants
        participants.forEach(participant => {
            // Send message participants that have open socket connection
            if (participant.readyState === WebSocket.OPEN) {
                this.sendMessage(message, participant);
            }
        });
    }

    _onMessage(message, channelId, ws) {
        if (message.messageType === constants.socketMessageType.AUTHENTICATION) {
            ws.user = message.authentication;
            const participants = channelManagement.getChannelParticipants(channelId);
            // Send updated channel participants to everyone
            this._sendMessageToEveryone({
                messageType: constants.socketMessageType.AUTHENTICATION,
                participants: participants.map(participant => participant.user)
            }, participants);
        } else {
            this._sendMessageToOthers(message, channelId, ws);
        }
    }

    _initialize() {
        this._wss.on('connection', (ws, req) => {
            const location = url.parse(req.url, true);
            const channelId = location.query.channelId;
            console.log(`Client connected to socket with channel ID: ${channelId}`);
            // Create new channel if it does not exist already
            channelManagement.addChannel(channelId);
            // Add participant to channel
            channelManagement.addParticipantToChannel(channelId, ws);

            ws.on('message', (message) => {
                console.log(`Socket received message: ${message}`);
                try {
                    message = JSON.parse(message);
                    this._onMessage(message, channelId, ws);
                } catch (e) {
                    console.log(e);
                }
            });

            ws.on('close', () => {
                console.log(`User disconnected from channel ${channelId}`);
                channelManagement.removeChannelParticipant(channelId, ws);
                this._sendMessageToOthers({
                    messageType: constants.socketMessageType.CONNECTION_CLOSED,
                    user: ws.user
                }, channelId, ws);
            });
        });
    }
}

module.exports = Socket;