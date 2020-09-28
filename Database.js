const express = require("express");
const app = express();
const path = require('path');
const mongo = require('mongodb');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const saltRounds = 10
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://Adamacy:NieInterere123@cluster0.x41no.mongodb.net/AleDrogo?retryWrites=true&w=majority"

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/" , function(req, res){
    res.sendFile(path.join(__dirname
        +'/index.html'));
})

app.listen(8080)
app.use('/public', express.static(path.join(__dirname, 'public')));

MongoClient.connect('mongodb+srv://Adamacy:NieInterere123@cluster0.x41no.mongodb.net/AleDrogo?retryWrites=true&w=majority', function(err, db){
    if (err) throw err;
    var dbo = db.db("mydb")
    app.post('/registration' ,function(req, res){
        bcrypt.hash(req.body.password, saltRounds, function(err, hash){
            dbo.collection('users').insertOne({'username':req.body.username, 'e-mail':req.body.email, 'password': hash}, function(err, res){
                if (err) throw err;
            console.log('1 Object inserted')
            db.close()
            })
    })
})
//     dbo.createCollection('users', function(err, res){
//         if (err) throw err;
//         console.log("Collection Created")
//         db.close();
//     });
});