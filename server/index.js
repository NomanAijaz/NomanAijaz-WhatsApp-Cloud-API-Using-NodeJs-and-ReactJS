const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();

dotenv.config({path:'config.env'});

app.use('/',(req, res)=>{
    res.json("Working fine");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});