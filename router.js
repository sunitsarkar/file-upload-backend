const express=require('express');
const router=express.Router();
const User=require('./model/filruser')
const multer=require('multer');
const file = require('./model/file');
const fs=require('fs')
const jwt=require('jsonwebtoken')

const secretKey="iamsunitsarkarfrombethuadahari741126"

router.post('/register',(req,res)=>{
    const FileUser=new User(req.body);

    FileUser.save();
    res.status(201).send(FileUser)
});

router.post('/login',async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
   const userlogin=await User.findOne({ username: username });
   
   if(userlogin){

    if(userlogin.password === password){
        const token= jwt.sign(userlogin.username,secretKey);
        console.log(token);
        res.cookie('jwtoken',token,{
            expires:new Date(Date.now()+ 2589200000),
            httpOnly:true
        })
        res.status(200).send({
            token
        })
    }
    else{
        res.sendStatus(401)
    }
   }
})

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'uploads')
    },
    filename: function (req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage:storage });

router.post("/upload",upload.single("file" || "pdf") , (req, res) => {
    
    const newfile= new file({
        name:req.body.name,
        file:{
            data:fs.readFileSync('uploads/'+ req.file.filename) ,
            contentType: 'image/png' || 'application/pdf'
        }
    })
    newfile.save().then(()=>{
        res.send("file successfully uploded")
    }).catch((err)=>{
        console.log(err)
    })
    
});

const verifyToken=(req,res,next)=>{
        console.log(req.cookie)
        const reqHeader=req.headers["cookie"];
        if(reqHeader){
            const bearer=reqHeader.split('=');
            const token=bearer[1];
            console.log(token)
            req.token=token;
            next()
        }
        else{
            res.send('invalid token')
        }
//   const bearerHeader=req.headers["authorization"]
//   if(bearerHeader){
//     const bearer=bearerHeader.split(' ');
//     const token=bearer[1];
//     req.token=token;
//     next();
//   }
//   else{
//     res.send('invalid token')
//   }
}

router.get('/files',async (req,res)=>{
    const allData=await file.find();
    res.send(allData)

    // jwt.verify(req.token,secretKey,(err,authData)=>{
    //     if(err){
    //        return res.send('invalid token')
    //     }else{
    //         res.send(allData)
    //     }
    // });
});

router.delete('/delet',(req,res)=>{
    file.deleteMany();
    res.send('deleted')
})






module.exports=router