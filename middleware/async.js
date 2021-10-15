const asyncHandler = fn => (req, res, next) =>
    //fn is a function
    Promise
        .resolve(fn(req, res, next)) // fn will be a functuon with the following parameters.
        .catch(next) // catch catches error.

module.exports = asyncHandler;