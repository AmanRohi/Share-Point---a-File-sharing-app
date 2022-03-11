const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const uploadsUrl = `/uploads`;

const FileSchema = mongoose.Schema({
    filename:{
        type:String,
        required:true
    },
    path:{
        type:String,
        required:true
    },
    size:{
        type:Number,
        required:true
    },
    uuid:{
        type:String,
        required:true
    },
    sender:{
        type:String,
        required:false
    },
    receiver:{
        type:String,
        required:false
    }

},{
    timestamps:true
})
const storage = multer.diskStorage({
    destination:function(req,file,done){
        done(null,path.join(__dirname,'/../',uploadsUrl));
    },
    filename:function(req,file,done){
        done(null,`${file.fieldname}-${Date.now()}-${(Math.round(Math.random()*(1E9)))}${path.extname(file.originalname)}`);
    }
});

const uploads = multer({
    storage:storage,
    limits:{fileSize:104857600}
}).single('file');

FileSchema.statics.uploadedFile = uploads;
const File = mongoose.model('File',FileSchema);
module.exports = File;