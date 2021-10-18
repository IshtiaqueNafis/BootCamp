//region base Files
const express = require('express'); // this for express
const dotenv = require("dotenv"); // this for dotNev
const morgan = require('morgan'); // this is the logger
const path = require('path');
const fileUpload = require('express-fileupload')
const errorHandler = require('./middleware/error')

dotenv.config({path: './config/config.env'}); /// this where the config is saved

//connecting to server
const connectDB = require('./config/db')
connectDB()

//app use
const app = express(); // express is the router.
app.use(express.json()) // this make sure data comes in json format


// this make use of devlopment.
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//fileupload middle ware
app.use(fileUpload())

//
app.use(express.static(path.join(__dirname,'public')))

//getting routes
const bootCamps = require('./routes/bootCampRoutes'); // this hold
const courses = require('./routes/courseRoutes');

//setting routes

app.use('/api/v1/bootcamps', bootCamps)
app.use('/api/v1/courses', courses);

//handles error
app.use(errorHandler)

const PORT = process.env.PORT || 5000; //  means either this will run or  the other

const server = app.listen(PORT, () => console.log(`Sever is running in ${process.env.NODE_ENV} mode on port ${PORT}`))

//handle unhandle rejection
process.on('unhandledRejection', (error, promise) => {
    console.log(`ERROR:${error.message}`)
    server.close(() => process.exit(1));

})