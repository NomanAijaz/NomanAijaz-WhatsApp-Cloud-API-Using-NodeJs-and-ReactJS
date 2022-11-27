const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const router = require('./router/route');

const app = express();

dotenv.config({path:'config.env'});

app.use(router);

const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});