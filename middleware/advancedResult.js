const advancedResults = (model, populate) => async (req, res, next) => {

    let query; // this the query

    //copy req.query
    const reqQuery = {...req.query}; // this will be breaking down.
    console.log(reqQuery)

    //fields to exclude from query
    const removeFields = ['select', 'sort', 'page', 'limit',]; // array will have the following value which is select query.

    //Loop over Remove fields and delete them from reqQuery
    for (const param of removeFields) {
        delete reqQuery[param];
    }

    // loop over reququery if it contains select remove it .


    //create query string
    let queryStr = JSON.stringify(reqQuery); // req.query is coming from req.query
    // convert it to JSON file
    console.log(queryStr)


    //create Operators ($GT,$ltg)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //region ****queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)****
    //
    /*
    gt--> greather than
    gte --> greater than equal to
    lt --> less than
    lte --> less than or equal to
    in --> means will get a list
    match => `$${match} will be either gt,gte,lt,lte in
     */

    //endregion


    //finding resource
    query = model.find(JSON.parse(queryStr)) // get the id based on query str
    //region the path where does it come come from for populate explained
    /*
    BootCampSchema.virtual('courses', {
    ref: 'Course', // this is the course table name
    localField: '_id', // this will be the id
    foreignField: 'bootcamp',// this the bootcamp id.
    justOne: false, // means get array of courses
})
     */

    //endregion

    // convert it to javascript object
    //SelectFields
    if (req.query.select) {
        const selectStatement = req.query.select.split(',').join(' '); // if there is a comma turns into an array then combine into string with spaces
        query = query.select(selectStatement); // if a name is here it will only pass thoose things.
    }

    //sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' '); // if there is a comma turns into an array then combine into string with spaces
        query = query.sort(sortBy); // if a name is here it will only pass thoose things.
    } else {
        query = query.sort('-createdAt'); //- means in decendinbg order
    }

    //const page
    const page = parseInt(req.query.page, 10) || 1; // ususally parse int come by string.

    const limit = parseInt(req.query.limit, 10) || 100; // ususally parse int come by string.

    const startIndex = (page - 1) * limit; // start of the page. //0

    const endIndex = page * limit; // this will show the end of page //1

    //region ***page,limit,startIndex&endIndex explained***

    /*
    const page = parseInt(req.query.page, 10) || 1 --> by defualt page is 1 however it can be any page I would want it to be.
     const limit = parseInt(req.query.limit, 10) || 100;  --> by default set to 100 however can be many page as possilbe.
         const startIndex = (page - 1) * limit; //
         lets say I am on page (1-1) * 1 -->0 index 2-->(2-1)*1 -->1 and so on its -1 here cause index always starrt from

           const endIndex = page * limit; --> page is 1 and and limit is 1 endindex will be 1 if its 2 will be 2
     */

    //endregion

    const total = await model.countDocuments()

    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate);
    }

    //foinding query
    const results = await query;

    //pagination Result

    // for going foroward
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
        //crates a nested object // { next: { page: 2 } }
    }

    //for going backward
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }
    next();
}
module.exports = advancedResults;