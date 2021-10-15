const Bootcamp = require('../models/BootCamp')


//region getBootCamps() --> get all bootcamps-->@route GET /api/v1/bootcamps-->acess  public
exports.getBootCamps = async (req, res, next) => {
    try {
        const bootCamps = await Bootcamp.find();
        if (!bootCamps) {
            return res.status(400).json({success: false}) //return has to be there to make it false.
        }

        res.status(200).json({
            success: true,
            data: bootCamps
        });
    } catch (err) {
        res.status(400).json({success: false})
    }
}
//exports is used for exporting function
//endregion


//region getBootCamp --> get  a single bootcamp-->@route GET /api/v1/bootcamps/:id-->acess  public
exports.getBootCamp = async (req, res, next) => {
    try {
        const bootCamp = await Bootcamp.findById(req.params.id)
        res.status(400).json({
            success: true,
            data: bootCamp
        })
    } catch (err) {
        res.status(400).json({success: false})
    }
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