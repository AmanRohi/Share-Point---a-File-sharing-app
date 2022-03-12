const {v4:uuidv4} = require('uuid');
const File = require('../models/File');
const mailer = require('../mailers/downloadFile');
require('dotenv').config();

module.exports.upload = function(req,res){
    File.uploadedFile(req,res, async (err)=>{
        if(!req.file){
            return res.status(201).json({
                message:'Enter all Fields',
            })
        }
        if(err){console.log("Error in uploading file",err); return;}
        let file = await File.create({
            filename:req.file.filename,
            size:req.file.size,
            path:req.file.path,
            uuid:uuidv4(),
        });
        return res.status(200).json({
            downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            uuid:file.uuid
        });
    });
}


module.exports.download = async function(req,res){
    try{
        let file = await File.findOne({uuid : req.params.uuid});
        if(!file){
            return req.status(404).json({
                message:"File Not Found !"
            });
        }
        res.download(file.path);
    } catch(err){
        console.log("Error in downloading the file",err);
    }
}

module.exports.downloadPage = async function(req,res){
    try{
        let file = await File.findOne({uuid : req.params.uuid});
        console.log(file);
        if(!file){
            return res.render('download',{
                error:'File Not Found',
            })
        }
        return res.render('download',{
            success:'File Found',
            filename:file.filename,
            size:Math.round(file.size/1024),
            downloadUrl:`${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
        })

    } catch(err){
        console.log("Error in downloading the file",err);
    }
}


module.exports.sendMail = async (req,res)=>{
    try{
        const {emailTo, emailFrom} = req.body;
        const uuid = req.params.uuid;
        console.log(req.body);
        let file = await File.findOne({uuid});
        console.log(file);
        let size = Math.round(file.size/1024);
        if(file.sender) {
            console.log("message Already sent");
            return res.status(200).json({
                message:'Message Already Sent'
            });
        }
        file.sender = emailFrom;
        file.reciever=emailTo;
        file.save();
        mailer(emailFrom,emailTo,size,24,file.filename,`${process.env.APP_BASE_URL}/files/${uuid}`);
        return res.status(200).json({
            message:'Message Sent'
        });
    }catch(err){
        console.log('Error in sendMail',err);
        return res.status(200).json({
            message:'Something went wrong',
            error:err,
        });
    }
    
}
