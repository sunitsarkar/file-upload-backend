const express=require('express');
const app=express();
require('dotenv').config()
const cors=require('cors');
const bodyparser=require('body-parser');
const router=require('./router');
const mongoose = require('mongoose');


//db connetion
const password=process.env.PASSWORD;
const url=`mongodb+srv://sunitsarkar:${password}@cluster0.gxschpx.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false);
mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('connected to database')
}).catch((err)=>{
    console.log(err)
})


app.use(cors());
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use('/',router)
app.listen(8000, ()=>{
    console.log("app is running on port 8000")
})
