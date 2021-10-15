//region base Files
const express = require('express'); // this for express
const dotenv = require("dotenv"); // this for dotNev
const morgan = require('morgan'); // this is the logger
const errorHandler = require('./middleware/error')

dotenv.config({path: './config/config.env'}); /// this where the config is saved

//connecting to server
const connectDB = require('./config/db')
connectDB()

//app use
const app = express(); // express is the router.

app.use(express.json())



// this make use of devlopment.
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//setting up routes
const bootCamps = require('./routes/bootcamp'); // this hold

app.use('/api/v1/bootcamps', bootCamps) ///api/v1/bootcamps will be the routes for all the current ones.
//endregion
app.use(errorHandler)

const PORT = process.env.PORT || 5000; //  means either this will run or  the other

const server = app.listen(PORT, () => console.log(`Sever is running in ${process.env.NODE_ENV} mode on port ${PORT}`))

//handle unhandle rejection
process.on('unhandledRejection', (error, promise) => {
    console.log(`ERROR:${error.message}`)
    server.close(() => process.exit(1));

})