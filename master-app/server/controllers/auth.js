const httpStatusCodes = require('http-status-codes');
const jwt = require('jwt-simple');
const userModel = require('../models/userSchema');
const constants = require('../utils/constants');
const helpers = require('../utils/helpers');
const CustomError = require('../utils/errors/customError');
const _ = require('lodash');

// TODO: hash passwords
// TODO: move this to config file
const jwtSecret = "jwtsecretmasterthesis";

let controllerInstance;

class AuthController {
    constructor(subjectObserver) {
        this._subjectObserver = subjectObserver;
        this.getUserFromToken = this.getUserFromToken.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    _removeObserver(observerId) {
        this._subjectObserver.removeObserver(observerId);
    }

    _notifyObservers(message, eventName) {
        this._subjectObserver.notifyObservers(message, eventName);
    }

    _prepareUser(user) {
        user = helpers.getCleanUser(user.toObject());
        user.token = jwt.encode(user, jwtSecret);
        return user;
    }

    getUserFromToken(req, res, next) {
        const token = req.body.token;
        if (!token) return next(new CustomError(CustomError.templates.general.unauthorized));

        const user = jwt.decode(token, jwtSecret);
        userModel.findById(user._id)
            .then(user => {
                if (!user) return Promise.reject(new CustomError(CustomError.templates.general.unauthorized));
                user = this._prepareUser(user);
                res.status(httpStatusCodes.OK).send(user)
            })
            .catch(error => next(error));
    }

    register(req, res, next) {
        let user = _.pick(req.body, ['name', 'surname', 'email', 'password', 'userType']);

        // If user is mentor assign additional properties to user object
        if (user.userType === constants.userTypes.MENTOR) {
            user = Object.assign(user, _.pick(req.body, ['knowledge', 'profession', 'about']));
            user.knowledge = _.compact(user.knowledge);
        }

        // Check if user with provided email already exists
        userModel.findByEmail(user.email)
            .then(() => new userModel(user).save())
            .then(user => {
                user = this._prepareUser(user);
                res.status(httpStatusCodes.OK).send(user);
            })
            .catch(error => next(error));
    }

    login(req, res, next) {
        const { email, password } = req.body;
        if (!email || !password) return next(new CustomError(CustomError.templates.general.badRequest));

        userModel.findOne({ email, password })
            .then(user => {
                if (!user) return Promise.reject(new CustomError(CustomError.templates.auth.invalidCredentials));
                if (user.userType === constants.userTypes.MENTOR) {
                    this._notifyObservers({
                        name: user.name,
                        surname: user.surname,
                        mentorID: user._id,
                        online: true
                    }, constants.sseMessageType.MENTOR_STATUS);
                    user.online = true;
                    return user.save();
                } else if (user.userType === constants.userTypes.BASIC_USER) {
                    return user;
                }
            })
            .then(user => {
                user = this._prepareUser(user);
                res.status(httpStatusCodes.OK).send(user);
            })
            .catch(error => next(error));
    }

    logout(req, res, next) {
        const { id } = req.body;
        if (!id) return next(new CustomError(CustomError.templates.general.badRequest));

        userModel.findById(id)
            .then(user => {
                if (!user) return Promise.reject(new CustomError(CustomError.templates.general.badRequest));
                if (user.userType === constants.userTypes.MENTOR) {
                    // Handle mentor login
                    this._notifyObservers({
                        name: user.name,
                        surname: user.surname,
                        mentorID: user._id,
                        online: false
                    }, constants.sseMessageType.MENTOR_STATUS);
                    user.online = false;
                    this._removeObserver(user._id);
                    return user.save();
                } else if (user.userType === constants.userTypes.BASIC_USER) {
                    // Handle regular user login
                    return user;
                }
            })
            .then(() => res.sendStatus(httpStatusCodes.OK))
            .catch(error => next({
                status: httpStatusCodes.BAD_REQUEST,
                message: error
            }));
    }
}

module.exports = {
    getInstance(subjectObserver) {
        if (!controllerInstance) controllerInstance = new AuthController(subjectObserver);
        return controllerInstance;
    }
};