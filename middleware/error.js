const ErrorResponse = require("../utlis/errorresponse");
const errorHandler = (err, req, res, next) => {
    let error = {...err} //grabing the error object
    error.message = err.message //set the error message.


    //console log for dev
    console.log(err.stack.red);

    //Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value} `
        error = new ErrorResponse(message,404)
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || `server Error`
    });

};
module.exports = errorHandler