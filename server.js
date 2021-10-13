const express = require('express'); // this for express
const dotenv = require("dotenv"); // this for dotNev
//region


//endregion


//route files
const bootCamps = require('./routes/bootcamp')

dotenv.config({path: './config/config.env'}); /// this where the config is saved

const app = express(); // express is the router.

//Mount Router
app.use('/api/v1/bootcamps',bootCamps) ///api/v1/bootcamps will be the routes for all the current ones.



const PORT = process.env.PORT || 5000; //  means either this will run or  the other
app.listen(PORT, () => console.log(`Sever is running in ${process.env.NODE_ENV} mode on port ${PORT}`))