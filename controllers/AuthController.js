const ErrorResponse = require('../utlis/errorresponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/UserModel');

//region  register User--> get all bootcamps-->@route GET /api/v1/register -->acess  public
exports.register = asyncHandler(async(req, res, next)=>{

 res.status(200).json({success: true})
})



//endregion