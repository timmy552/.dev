require('dotenv').config()
const mongoose = require('mongoose');
console.log(process.env.DB)
// const dbLink = 'mongodb+srv://Timmy22:iCZCRmbomrp8hZ7Y@cluster0.mk2fyaq.mongodb.net/'
function connectDB(){
    
    try{
        console.log("connection to db")
        mongoose.connect((process.env.DB),{
            useNewUrlParser:true,
            useUnifiedTopology:true,

        })
        // mongoose.connect('mongodb://127.0.0.1:27017/database')
        console.log("connected")
    } catch (error) {
          console.log(error)
    }
}


module.exports = connectDB