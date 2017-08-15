const helpers = {
    getCleanUser(user) {
        delete user.password;
        delete user.__v;
        return user;
    }
}

module.exports = helpers;