const ErrorResponse = require('../utlis/errorresponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utlis/sendEmail');
const User = require('../models/UserModel');
const {sendTokenResponse} = require("../middleware/auth");
const crypto = require('crypto');
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


//region get Current Logged In User,POST /API/v1/auth/me private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id); // this comes from the request

    res.status(200).json({
        success: true,
        data: user,
    })
});


//endregion

//region ForgotPassword User,POST /API/v1/auth/me private
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email}); // look for user based on email .
    //req.body.email comes from here this will help with the password reset. 

    if (!user) {
        return next(new ErrorResponse(`there is no user with that email `, 404))
    } // if user not found return this error.
    //create reset URL
    const resetToken = user.getResetPasswordToken(); // get the reset token
    await user.save({validateBeforeSave: false}); // prevents saving

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`; // sent url for reset

    const message = `you  requested reset email password ${resetUrl}` // then the message
    try {
        await sendEmail({
            email: user.email,
            subject: 'password reset token',
            message
        });
        res.status(200).json({success: true, data: 'Email sent'});
    } catch (error) {
        console.log(error)
        user.resetPasswordToken = undefined;
        user.resetPasswordDate = undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorResponse(`email could be sent`, 500));
    }

});


//endregion

//region resetPassword PUT request private --> PUT and RESET PASSWORD --> /api/auth/resetpassword/:ResetToken -->public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordDate: {$gt: Date.now()}// means greater than now.
    });
    if (!user) {
        return next(new ErrorResponse(`Invalid Token`, 400));
    }
    //set new passwrod
    user.password = req.body.password;
    user.resetPasswordToken = undefined
    user.resetPasswordDate = undefined
    await user.save();
    sendTokenResponse(user, 200, res);
})


//endregion

//region UPDATE USER DETAILS PUT,auth/v1/auth/updatedetails/ private.
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    }); // this comes from the request

    res.status(200).json({
        success: true,
        data: user,
    })
});


//endregion


//region update user password,Put /API/v1/auth/updatepassword private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password') // + means which requests will be added.

    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is in correct', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});


//endregion