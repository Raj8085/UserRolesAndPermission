const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
       
    },
    role : {
        type : Number,
        default : 0,  //0 - normal User , 1 -- Admin, 2 --  sub-Admin , 3 -- Editor
    }
})

module.exports = mongoose.model("User",userSchema);

 