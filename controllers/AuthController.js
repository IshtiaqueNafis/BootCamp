const ErrorResponse = require('../utlis/errorresponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/UserModel');

//region  register User--> get all bootcamps-->@route GET /api/v1/register -->acess  public
exports.register = asyncHandler(async(req, res, next)=>{

const {name,email,password,role} = req.body
 
 //create user 
 const user = await User.create({
  name,
  email,
  password,
  role
 })

 res.status(200).json({
  success:true,

 })

})



//endregion