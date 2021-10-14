const Bootcamp = require('../models/BootCamp')


//region getBootCamps() --> get all bootcamps-->@route GET /api/v1/bootcamps-->acess  public
exports.getBootCamps = (req, res, next) => {
    res.status(200).json({success: true, msg: `showing all bootcamps`});
}
//exports is used for exporting function
//endregion


//region getBootCamp --> get  a single bootcamp-->@route GET /api/v1/bootcamps/:id-->acess  public
exports.getBootCamp = async (req, res, next) => {

}
//endregion


//region createBootCamp  -->  reate single bootcamp --> route POST /api/v1/bootcamps/:id -->/ acess  private
exports.createBootCamp = async (req, res, next) => {

    try {
        const bootcamp = await Bootcamp.create(req.body); // this creates the bootcamp
        res.status(201).json({
            success: true,
            data: bootcamp
        })

    } catch (err) {
        res.status(400).json({success: false})
    }
}
//endregion


//region updateBootCamp -->@route PUT /api/v1/bootcamps/:id-->access  private
exports.updateBootCamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `updaing bootcamp ${req.params.id}`});
}
//endregion


//region deleteBootCamp --> @route Delete /api/v1/bootcamps/:id -->access  private
exports.deleteBootCamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `deleting  bootcamp ${req.params.id}`});
}
//endregion