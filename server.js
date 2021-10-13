const express = require('express'); // this for express
const dotenv = require("dotenv"); // this for dotNev
const logger = require("./middleware/logger");
const morgan = require('morgan'); // this is the logger
const connectDB = require('./config/db')

const app = express(); // express is the router.

//dev logging env
dotenv.config({path: './config/config.env'}); /// this where the config is saved
//route files
const bootCamps = require('./routes/bootcamp');


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


//Mount Router
app.use('/api/v1/bootcamps', bootCamps) ///api/v1/bootcamps will be the routes for all the current ones.


const PORT = process.env.PORT || 5000; //  means either this will run or  the other

const server = app.listen(PORT, () => console.log(`Sever is running in ${process.env.NODE_ENV} mode on port ${PORT}`))

//handle unhandle rejection
process.on('unhandledRejection', (error, promise) => {
    console.log(`ERROR:${error.message}`)
    server.close(() => process.exit(1));

})