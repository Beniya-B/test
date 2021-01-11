const mongoose = require("mongoose");
// var fs = require('fs');
// var path = require('path');
// var multer = require('multer');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
    // createdAt: {
    //     type: Date,
    //     default: Date.now()
    // }
});

const BookSchema=mongoose.Schema({
    bookName:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    publisher:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    img:{
        data: Buffer,
        contentType: String
    }
});

// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });

// var upload = multer({ storage: storage });

// export model user with UserSchema
module.exports = mongoose.model("users", UserSchema);
module.exports = mongoose.model("books", BookSchema);