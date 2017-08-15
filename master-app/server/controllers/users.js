const httpStatusCodes = require('http-status-codes');
const userModel = require('../models/userSchema');
const constants = require('../utils/constants');
const CustomError = require('../utils/errors/customError');
const generateId = require('uuid/v1');

// Singleton
let controllerInstance;

class UsersController {
    constructor(subjectObserver) {
        this._subjectObserver = subjectObserver;
        this.addObserver = this.addObserver.bind(this);
        this.toggleMentorOnlineStatus = this.toggleMentorOnlineStatus.bind(this);
        this.callProcess = this.callProcess.bind(this);
    }

    /**
     * Broadcast message to observers
     * @param message {*}
     * @private
     */
    _notifyObservers(message, eventName) {
        this._subjectObserver.notifyObservers(message, eventName);
    }

    /**
     * Send message to one observer
     * @param observerId {String}
     * @param message {*}
     * @private
     */
    _notifyObserver(observerId, message, eventName) {
        this._subjectObserver.notifyObserverById(observerId, message, eventName);
    }

    getMentors(req, res, next) {
        userModel.find({ userType: constants.userTypes.MENTOR })
            .then(data => res.status(httpStatusCodes.OK).json(data))
            .catch(error => next(error));
    }

    toggleMentorOnlineStatus(req, res, next) {
        const id = req.body.id;
        if (!id) return next(new CustomError(CustomError.templates.general.badRequest));

        userModel.findByIdAndToggleOnline(id)
            .then(updatedMentor => {
                this._notifyObservers({
                    name: updatedMentor.name,
                    surname: updatedMentor.surname,
                    mentorID: updatedMentor._id,
                    online: updatedMentor.online
                }, constants.sseMessageType.MENTOR_STATUS);
                res.status(httpStatusCodes.OK).send({ online: updatedMentor.online });
            })
            .catch(error => next(error));
    }

    addObserver(req, res, next) {
        const id = req.query.id;
        if (!id) return next(new CustomError(CustomError.templates.general.badRequest));
        // Add unique id to observer
        res.id = id;
        // Add observer update method
        res.update = function (message, eventName) {
            // this is referring to res object
            this.pushMessage(message, eventName);
        };
        console.log(`${res.id} started observing.`);
        // Push observer to array
        this._subjectObserver.addObserver(res);
        res.on('close', () => this._subjectObserver.removeObserver(res.id));
    }

    callProcess(req, res, next) {
        const { senderId, senderName, recipientId, callRequestType, channelId } = req.body;
        if (!senderId || !recipientId || !callRequestType) {
            return next(new CustomError(CustomError.templates.general.badRequest));
        }

        // Notify observer
        this._notifyObserver(recipientId, {
            senderId,
            senderName,
            callRequestType,
            channelId
        }, constants.sseMessageType.CALL);

        res.status(httpStatusCodes.OK).send();
    }

    requestFeedback(req, res, next) {
        const { userId, mentorId } = req.body;

        // Find mentor by ID
        userModel.findById(mentorId)
            .select('name surname')
            .lean()
            .exec()
            .then(mentor => {
                if (!mentor) return Promise.reject(new CustomError(CustomError.templates.general.badRequest));
                mentor.mentorId = mentorId;
                mentor.feedbackRequestId = generateId();
                console.log(mentor);
                return userModel.findByIdAndUpdate(userId, {$push: { feedbackRequests: mentor }});
            })
            .then(user => {
                if (!user) return Promise.reject(new CustomError(CustomError.templates.general.badRequest));
                res.sendStatus(httpStatusCodes.OK);
            })
            .catch(error => {
                console.log(error);
                next(error);
            });
    }

    submitFeedback(req, res, next) {
        const { userId, mentorId, feedbackRequestId, rating } = req.body;

        Promise.all([
            userModel.findByIdAndUpdate(mentorId, {$push: { ratings: rating }}),
            userModel.findByIdAndUpdate(userId, {$pull: { feedbackRequests: { feedbackRequestId } }})
        ])
            .then(() => {
                console.log(`Request feedback ${feedbackRequestId} fulfilled and deleted`);
                res.sendStatus(httpStatusCodes.OK);
            })
            .catch(error => next(error));
    }
}

module.exports = {
    getInstance(subjectObserver) {
        if (!controllerInstance) controllerInstance = new UsersController(subjectObserver);
        return controllerInstance;
    }
};