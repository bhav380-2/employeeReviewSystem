import dotenv from require('dotenv');
dotenv.config();
import mongoose from 'mongoose';

// connecting to mongodb
mongoose.connect(MONG_URL);

const db = mongoose.connection;  //storing connection status in db

db.on('error', console.error.bind(console, "Error connecting to MongoDB")); // if error connecting to db

db.once('open', function(){ // on successfull connection
    console.log('Connected to Database :: MongoDB');
});

export default db;