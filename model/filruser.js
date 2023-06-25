const mongoose=require('mongoose');

const FileUser=mongoose.Schema({
    name:String,
    username:String,
    password:String
})


module.exports=mongoose.model('FileUser',FileUser)