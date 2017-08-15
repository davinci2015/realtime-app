const Channel = require('./channel');

class ChannelManagement {
    constructor() {
        this._channels = new Map();
    }

    addChannel(id) {
        if (typeof this._channels.get(id) === 'undefined') {
            this._channels.set(id, new Channel(id));
        }
    }

    /**
     * Get participants from channel
     * @param id {String} - channel ID
     * @returns {*}
     */
    getChannelParticipants(id) {
        const channel = this._channels.get(id);
        return channel.getParticipants();
    }

    /**
     * Remove participant from channel
     * @param id {String} - Channel ID
     * @param participant {Object} - Socket instance
     */
    removeChannelParticipant(id, participant) {
        const channel = this._channels.get(id);
        channel.deleteParticipant(participant);
        this._channels.set(id, channel);
    }

    addParticipantToChannel(id, participant) {
        const channel = this._channels.get(id);
        channel.addParticipant(participant);
        this._channels.set(id, channel);
    }
};

module.exports = new ChannelManagement();