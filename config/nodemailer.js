const ejs = require('ejs');
const path =require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = nodemailer.createTransport({
    service:process.env.MAIL_SERVICE,
    host:process.env.MAIL_HOST,
    port:587,
    secure:false,
    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASS,
    }
});


let renderTemplate = (data,relativePath)=>{
    let html;
    ejs.renderFile(
        path.join(__dirname,'../views/templates',relativePath),
        data,
        function(err,temp){
            if(err){console.log('error in rendering the template of email'); return;}
            html=temp;
        }
    )
    return html;
}

module.exports = {
    transporter,
    renderTemplate
}


