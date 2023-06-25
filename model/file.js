const mongoose=require('mongoose');


const File=mongoose.Schema({
    name:String,
    file: {
        data:Buffer,
        contentType: String
    }
})

module.exports=mongoose.model('File',File)