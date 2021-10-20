const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utlis/errorresponse');
const User = require('../models/UserModel')

//region Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization // checks if there is a header for authorization
        && req.headers.authorization.startsWith('Bearer') // checks if it has bearer
    ) {
        token = req.headers.authorization.split(' ')[1]; // get the token from there
    }/* else if (req.cookies) {
        token = req.cookies.token;
    }
*/
    if (!token) {
        return next(new ErrorResponse(`Not authorized to Access this Route`, 401)); // if there is no token means it wont work.
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verifiy the token based on JWT_Seceret and id.
        //{ id: '616f0af262b31919ff2da627', iat: 1634742531, exp: 1637334531 } this is the property from decoded
        req.user = await User.findById(decoded.id) // based on the Id entered find the user
        next();
    } catch (err) {
        return next(new ErrorResponse(`Not authorized to Access this Route`, 401)); // if not just return next
    }
})
//endregion