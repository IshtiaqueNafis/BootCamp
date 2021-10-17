//region File function
/*
Custom error class created for error handling of data
 */

//endregion

class ErrorResponse extends Error {


    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode
    }
}

module.exports = ErrorResponse