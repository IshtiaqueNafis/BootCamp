const {connect} = require('mongoose'); // mongoose being exported here

const connectDB = async () => {
    const conn = await connect(process.env.MONGO_URI, {
        // mongoose.connect this connects to database.
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`)
};
// connectDB
module.exports = connectDB;