const mongoose = require('mongoose');
const config = require('../../config');

class DB {
    constructor() {
        // Set mongoose.Promise to global Promise implementation
        mongoose.Promise = global.Promise;
    }

    connect() {
        mongoose.connect(config.databaseURL, {
            useMongoClient: true
        }, function (error) {
            if (error) {
                console.error("Please make sure Mongodb is installed and running!");
                throw error;
            }
        });
    }
}

module.exports = new DB();