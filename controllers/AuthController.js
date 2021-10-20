const ErrorResponse = require('../utlis/errorresponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/UserModel');

//region  register User--> get all bootcamps-->@route GET /api/v1/register -->acess  public
exports.register = asyncHandler(async (req, res, next) => {

    const {name, email, password, role} = req.body;

    //create user
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res);

})

//endregion


//region  logIn User--> get all bootcamps-->@route GET /api/v1/register -->acess  public
exports.login = asyncHandler(async (req, res, next) => {

    const {password, email} = req.body

    if (!email || !password) {
        return next(new ErrorResponse('please provide an email or password', 400));
    }
    //check for user

    const user = await User.findOne({email}).select("+password"); // think of password to be included here.

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401)); // 401 means unauthorized
    }

//check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401)); // 401 means unauthorized
    }

    sendTokenResponse(user, 200, res);

});

//endregion


//region  get token from the model and create cookie and send response

const sendTokenResponse = (user, statusCode, res) => {
    //create token
    const token = user.getSingedJWTTOKEN();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true, //this make sure only client can acess it.

    };
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })

};

//endregion

//region get Current Logged In User,POST /API/v1/auth/me private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id); // this comes from the request

    res.status(200).json({
        success: true,
        data: user,
    })
});


//endregion