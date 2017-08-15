const mongoose = require('mongoose');
const CustomError = require('../utils/errors/customError');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    feedbackRequests: {
        type: Array
    },
    ratings: {
        type: Array
    },
    knowledge: {
        type: Array
    },
    profession: {
        type: String
    },
    about: {
        type: String
    },
    online: {
        type: Boolean,
        default: false
    },
    userType: {
        type: Number
    }
});

userSchema.statics.findByIdAndToggleOnline = function (id) {
    return new Promise((resolve, reject) => {
        this.findById(id)
            .then(mentor => {
                if (!mentor) reject(new Error('No mentor with provided ID'));
                const online = !mentor.online;
                return this.findByIdAndUpdate(id, {online}, {new: true});
            })
            .then(updatedMentor => resolve(updatedMentor))
            .catch(error => reject(error));
    });
}

userSchema.statics.findByEmail = function (email) {
    return new Promise((resolve, reject) => {
        this.findOne({email})
            .then(user => {
                if (user) reject(new CustomError(CustomError.templates.auth.emailAlreadyExists));
                else resolve();
            })
            .catch(error => reject(error));
    });
}

const UserModel = mongoose.model('user', userSchema);
module.exports = UserModel;