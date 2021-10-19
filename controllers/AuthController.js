const ErrorResponse = require('../utlis/errorresponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/UserModel');

//region  register User--> get all bootcamps-->@route GET /api/v1/register -->acess  public
exports.register = asyncHandler(async (req, res, next) => {

    const {name, email, password, role} = req.body

    //create user
    const user = await User.create({
        name,
        email,
        password,
        role
    })

    const token = user.getSingedJWTTOKEN(); // create user token
    res.status(200).json({
        success: true,
        token

    })

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

    const token = user.getSingedJWTTOKEN(); // create user token
    res.status(200).json({
        success: true,
        token

    })

});

//endregion