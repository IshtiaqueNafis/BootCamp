
//region getBootCamps() --> get all bootcamps-->@route GET /api/v1/bootcamps-->acess  public
exports.getBootCamps = (req,res,next) =>{
    res.status(200).json({success: true, msg: `showing all bootcamps`});
}
//exports is used for exporting function
//endregion


//region getBootCamp --> get  a single bootcamp-->@route GET /api/v1/bootcamps/:id-->acess  public
exports.getBootCamp = (req,res,next) =>{
    res.status(200).json({success: true, msg: `showing all bootcamps`});
}
//endregion


//region createBootCamp  -->  reate single bootcamp --> route POST /api/v1/bootcamps/:id -->/ acess  private
exports.createBootCamp = (req,res,next) =>{
    res.status(200).json({success: true, msg: `showing bootcamp ${req.params.id}`});
}
//endregion


//region updateBootCamp -->@route PUT /api/v1/bootcamps/:id-->access  private
exports.updateBootCamp = (req,res,next) =>{
    res.status(200).json({success: true, msg: `updaing bootcamp ${req.params.id}`});
}
//endregion


//region deleteBootCamp --> @route Delete /api/v1/bootcamps/:id -->access  private
exports.deleteBootCamp = (req,res,next) =>{
    res.status(200).json({success: true, msg: `deleting  bootcamp ${req.params.id}`});
}
//endregion