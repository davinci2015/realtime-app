class Channel {
    constructor(id) {
        this._id = id;
        this._participants = [];
    }

    addParticipant(participant) {
        this._participants.push(participant);
    }

    deleteParticipant(participant) {
        this._participants = this._participants.filter(client => client !== participant);
    }

    getParticipants() {
        return this._participants;
    }
}

module.exports = Channel;