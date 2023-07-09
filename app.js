require("dotenv").config();
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require("path");
require("./db/conn");
const Products=require('./models/productsSchema');
const DefaultData=require('./defaultdata');
const cors=require('cors');
const router=require('./routes/router');
const cookieParser=require('cookie-parser')
app.use(express.json());
app.use(cookieParser(""));
app.use(cors());
app.use(router);

const port=process.env.PORT || 3001;
//serving the front end
app.use(express.static(path.join(__dirname,"./client/build")));
app.get("*",(req,res)=>{
    res.sendFile(
        path.join(__dirname,"./client/build/index.html"),
        function(err){
            res.status(500).send(err);
        }
    )
})
app.listen(port,()=>{
    console.log(`Server is running on port number ${port}`);
})
DefaultData();