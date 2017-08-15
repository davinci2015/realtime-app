const CustomError = require('../utils/errors/customError');

module.exports = function (req, res, next) {
    next(new CustomError(CustomError.templates.general.notFound));
}