const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.DATABASE_URL);


const db = mongoose.connection;
db.on('error',console.error.bind('console','Something Went Wrong ! '));
db.once('open',()=>{
    console.log("Successfully connected with the database ");
})

module.exports = db;