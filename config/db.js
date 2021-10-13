const mongoose = require('mongoose'); // mongoose being exported here

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        // mongoose.connect this connects to database.
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModifyIndex: true,
        useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`)
}
module.exports = connectDB;