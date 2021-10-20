const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//load environment variables
dotenv.config({path: './config/config.env'});

// load BootCamp
const Bootcamp = require('./models/BootCampModel');
const Course = require('./models/CourseModel');
const User = require('./models/UserModel');

//mongo db connect
mongoose.connect(process.env.MONGO_URI, {
        // mongoose.connect this connects to database.
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);
//reading files
const bootCamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'))

//import into db
const importData = async () => {
    try {
        await Bootcamp.create(bootCamps)
        await Course.create(courses)
        await User.create(users)
        console.log('Data Imported')
    } catch (err) {
        console.log(err)
    }
}

//delete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        console.log('Data Deleted')
    } catch (err) {
        console.log(err)
    }
}

if (process.argv[2] === "-i") {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}