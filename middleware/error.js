const ErrorResponse = require("../utlis/errorresponse");
const errorHandler = (err, req, res, next) => {
    let error = {...err} //grabing the error object
    error.message = err.message //set the error message.


    //Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value} `
        error = new ErrorResponse(message, 404)
    }
    // duplicate id
    if (err.code === 11000) {
        const message = 'Duplicate Field value entered'
        error = new ErrorResponse(message, 400)
    }
    //validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(error.errors).map(val => val.message); // this gets the message.
        error = new ErrorResponse(message, 400)
    }


    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || `server Error`
    });

};
module.exports = errorHandler