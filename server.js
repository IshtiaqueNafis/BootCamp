//region base Files
const express = require('express'); // this for express
const dotenv = require("dotenv"); // this for dotNev
const morgan = require('morgan'); // this is the logger
const path = require('path');
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error')

dotenv.config({path: './config/config.env'}); /// this where the config is saved

//connecting to server
const connectDB = require('./config/db')
connectDB()

//app use
const app = express(); // express is the router.
app.use(express.json()) // this make sure data comes in json format

app.use(cookieParser());

// this make use of devlopment.
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//fileupload middle ware
app.use(fileUpload())
app.use(mongoSanitize()); /* this prevents security issues */
app.use(helmet()); // set security headers
//prevent xss Attacks
app.use(xss()); // prevents xss attacks.
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // maximum 10 mins for request.
    max: 100
});
app.use(limiter);
app.use(hpp()); // prevents http param poplution.
app.use(express.static(path.join(__dirname, 'public')))

//getting routes
const bootCamps = require('./routes/bootCampRoutes'); // this hold
const courses = require('./routes/courseRoutes');
const auth = require('./routes/AuthRoutes');
const users = require('./routes/UserRoutes');
const reviews = require('./routes/ReviewRoutes');
//setting routes

app.use('/api/v1/bootcamps', bootCamps)
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);
app.use(cors());

//handles error
app.use(errorHandler)

const PORT = process.env.PORT || 5000; //  means either this will run or  the other

const server = app.listen(PORT, () => console.log(`Sever is running in ${process.env.NODE_ENV} mode on port ${PORT}`))

//handle unhandle rejection
process.on('unhandledRejection', (error, promise) => {
    console.log(`ERROR:${error.message}`)
    server.close(() => process.exit(1));

})