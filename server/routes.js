const express = require("express");
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const router = express.Router();
let fs = require('fs');
let path = require('path');
let multer = require('multer');


const User = require("../server/model/model");

const DIR = './public/';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR)
    },
    filename: (req, file, cb) => {
        // console.log("file---------------",file);
        cb(null, file.fieldname + '-' + Date.now())
    }
});

let upload = multer({ storage: storage,fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    } });



router.post("/login", [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const { email, password } = req.body;
        console.log("email, password ------",email, password );
        try {
            const MongoClient = require('mongodb').MongoClient;
            MongoClient.connect("mongodb://localhost:27017/library",{
                useNewUrlParser: true
            }, function (err, client) {
                if (err) {
                    return console.log(err);
                }
                let db = client.db("library");
                const collection = db.collection('users');
                collection.findOne({
                    email:email
                }).then(result=>{
                    // console.log("result--------------",result);
                    if (result===null)
                    {
                        res.status(400).json({
                                        message: "User Not Exist"
                                    });
                    }else if (password!== result.password){
                        return res.status(400).json({
                            message: "Incorrect Password !"
                        });
                    }else {
                        res.send({ message: "user exist",response:result})
                    }
                });
                client.close()
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: "Server Error"
            });
        }
    }
);

router.get("/allBooks",function (req,res) {
    try {
        const MongoClient = require('mongodb').MongoClient;
        MongoClient.connect("mongodb://localhost:27017/library",{
            useNewUrlParser: true
        }, function (err, client) {
            if (err) {
                return console.log(err);
            }
            let db = client.db("library");
            const collection = db.collection('books');
            collection.find().toArray(function (err, items) {
                // console.log("items;;;;;;;", items)
                if (items.length > 0) {
                            res.send({result: items});
                }else {
                        res.send({Error:'No data'})
                }
                client.close();

            });
        });

    }catch (e) {
        console.log("Exiting from allBooks: ",e)
    }
});

router.post("/addBook",upload.single('bookCover'),function (req,res) {
    try {
        // console.log("bookname***************",req.body);
        let obj = {
            bookName: req.body.bookname,
            author: req.body.author,
            publisher: req.body.publisher,
            category: req.body.category,
            img:req.body.bookCover
            // img: {
            //     data: fs.readFileSync(path.join(__dirname + '/bookCover/' + req.file.file)),
            //     contentType: 'image/png'
            // }
        };

        // console.log("object-----------",obj);
        const MongoClient = require('mongodb').MongoClient;
        MongoClient.connect("mongodb://localhost:27017/library",{
            useNewUrlParser: true
        }, function (err, client) {
            if (err) {
                return console.log(err);
            }
            let db = client.db("library");
            const collection = db.collection('books');
            // console.log("obj.bookName;;;;;;;", obj.bookName)
            collection.find("bookName:" + obj.bookName).toArray(function (err, items) {
                // console.log("items;;;;;;;", items)
                if (items.length > 0) {
                    items.forEach(function (item) {
                        if (item.bookName === obj.bookName) {
                            res.send({result: "Book already exist"})
                        }
                    });
                    // client.close();
                } collection.insertOne(obj, function (err) {
                    if (err) {
                        console.log(err.code);
                        res.send({
                            result: err.code
                        });
                        client.close();
                    } else {
                        console.log("book added");
                        res.send({result: "Book added successfully"})
                    }
                    client.close()
                });

            });
        });
    }catch (e) {
        console.log("Exiting from addBook: ",e)
    }

});

router.post("/updateBook",upload.single('bookCover'),function (req,res) {

    try {
        let query=req.body.bookname
        let obj = {
            author: req.body.author,
            publisher: req.body.publisher,
            category: req.body.category,
            img:req.body.bookCover
        };
        // console.log("object####################",obj);
        const MongoClient = require('mongodb').MongoClient;
        MongoClient.connect("mongodb://localhost:27017/library",{
            useNewUrlParser: true
        }, function (err, client) {
            if (err) {
                return console.dir(err);
            }
            let db = client.db("library");
            const collection = db.collection('books');
            collection.updateOne(
                {bookName:query},
                {
                    $set: obj
                },
                function (err,response) {
                    if (err) {
                        console.log(err);
                        res.send({
                            result: 'Failed'
                        });
                        console.log("Exiting from updateBook: ",err);
                        client.close();
                    } else {
                        res.send({
                            result: 'Updated'
                        });
                        client.close();
                    }
                }
            );
        });

    }catch (e) {
        console.log("Exiting from updateBook: ",e)
    }

})


router.post('/deleteBook',function (req,res) {

    try {
        let query=req.body.bookname;
        const MongoClient = require('mongodb').MongoClient;
        MongoClient.connect("mongodb://localhost:27017/library",{
            useNewUrlParser: true
        }, function (err, client) {
            if (err) {
                return console.dir(err);
            }
            let db = client.db("library");
            const collection = db.collection('books');
            collection.removeOne({bookName:query}, function (err,response) {
                    if (err) {
                        console.log(err);
                        res.send({
                            result: 'Failed'
                        });
                        debug.debugTrace("Exiting from updateDevice",0,verbose,true,err)
                        client.close();
                    } else {
                        res.send({
                            result: 'Deleted'
                        });
                        client.close();
                    }
                }
            );
        });

    }catch (e) {
        console.log("Exiting from deleteBook: ",e)
    }

})

router.post('/purchaseBook',function (req,res) {
    try {
        let data;
        let query = req.body.bookname;
        const MongoClient = require('mongodb').MongoClient;
        MongoClient.connect("mongodb://localhost:27017/library", {
            useNewUrlParser: true
        }, function (err, client) {
            if (err) {
                return console.dir(err);
            }
            let db = client.db("library");
            const collection = db.collection('bookStock');
            collection.find().toArray(function (err, items) {
                console.log("items boostock---------------", items,query);
                if (items[0].available_books.length > 0) {
                    items[0].available_books.forEach(function (item,i) {
                        // console.log("index=====",i);
                            if (item===query){
                                delete items[0].available_books[i]
                            }
                    });
                    items[0].rented_books.push(query);
                    data={
                        available_books:items[0].available_books,
                        rented_books:items[0].sold_books
                    }
                }

                collection.updateOne(
                    {id:1},
                    {
                        $set: data
                    },
                    function (err,response) {
                        if (err) {
                            console.log(err);
                            res.send({
                                result: 'Failed'
                            });
                            console.log("Exiting from updateBook: ",err);
                            client.close();
                        } else {
                            res.send({
                                result: 'Updated stock'
                            });
                            client.close();
                        }
                    }
                );
            });


        })

    } catch (e) {
        console.log("Exiting from deleteBook: ", e)
    }
})


module.exports = router;
