require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const db = require('./config/mongoose');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');

app.use(cors({
    origin:'*'
}))

app.use(express.urlencoded());
app.use(express.static('Assets'));
app.use(expressLayouts);

app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

app.set('view engine','ejs');
app.set('views','views');

app.use('/',require('./routes'));



app.listen(port,(err)=>{
    if(err) {console.log('Error in connecting with the server : ',err); return;}
    console.log("Successfully connected with the server : on port ",port);
})
