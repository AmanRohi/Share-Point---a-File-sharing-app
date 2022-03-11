const nodeMailer = require('../config/nodemailer');

const mailer = (sender,receiver,size,expires,filename,donwloadlink)=>{
    let htmlString = nodeMailer.renderTemplate({sender,filename,donwloadlink,size,expires},'email.ejs');
    nodeMailer.transporter.sendMail({
        from:sender,
        to:receiver,
        subject:'Share Point sharing file',
        html:htmlString
    },(err,info)=>{
        if(err){
            console.log('Error in sending the mailes',err);
            return;
        }
        console.log(info);
        return;
    })
}

module.exports = mailer;