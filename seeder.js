const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//load environment variables
dotenv.config({path: './config/config.env'});

// load BootCamp
const Bootcamp = require('./models/BootCamp');

//mongo db connect
mongoose.connect(process.env.MONGO_URI, {
        // mongoose.connect this connects to database.
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

const bootCamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

//import into db
const importData = async () => {
    try {
        await Bootcamp.create(bootCamps)
        console.log('Data Imported')
    } catch (err) {
        console.log(err)
    }
}

//delete data

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        console.log('Data Deleted')
    } catch (err) {
        console.log(err)
    }
}

if(process.argv[2]==="-i"){
    importData();
}else if(process.argv[2]==='-d'){
    deleteData();
}