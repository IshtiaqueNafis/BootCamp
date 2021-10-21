const ErrorResponse = require('../utlis/errorresponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/UserModel');
const {sendTokenResponse} = require("../middleware/auth");
const {use} = require("express/lib/router");

//region  GET all USERS // --> get request --> /api/v1/auth/users private/admin
exports.getUsers = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults);

})

//endregion




//endregion

//region GET single user // --> get request --> /api/v1/auth/users/:id private/admin

exports.getSingleUser = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorResponse(`no User with ${req.params.id} exists`, 404))
    }

    res.status(200).json({
        success: true,
        data: user
    })

})
//endregion


//region create User // --> post --> /api/v1/auth/users private/admin

exports.createUser = asyncHandler(async (req, res, next) => {

    const user = await User.create(req.body);


    res.status(201).json({
        success: true,
        data: user
    })

})
//endregion


//region Update  User // --> PUT --> /api/v1/auth/users/:id private/admin

exports.updateUser = asyncHandler(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })


    res.status(201).json({
        success: true,
        data: user
    })

})
//endregion

//region update  User // --> PUT --> /api/v1/auth/users/:id private/admin

exports.updateUser = asyncHandler(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })


    res.status(201).json({
        success: true,
        data: user
    })

})
//endregion

//region delete  User // --> Delete --> /api/v1/auth/users/:id private/admin
exports.deleteUser = asyncHandler(async (req, res, next) => {

    await User.findByIdAndDelete(req.params.id);


    res.status(201).json({
        success: true,
        data: {}

    })

})

//endregion