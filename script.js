const express = require("express");
const app = express();
const path = require('path');
const mongo = require('mongodb');
const bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://Adamacy:NieInterere123@cluster0.x41no.mongodb.net/AleDrogo?retryWrites=true&w=majority"

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/" , function(req, res){
    res.sendFile(path.join(__dirname
        +'/index.html'));
})
app.post('/', function(req, res){
    console.log(req.body)
    res.send(req.body)
})
app.listen(8080)
app.use('/public', express.static(path.join(__dirname, 'public')));
MongoClient.connect(url, function(err, db){
    if (err) throw err;
//     var dbo = db.db("mydb")
//     dbo.createCollection('users', function(err, res){
//         if (err) throw err;
//         console.log("Collection Created")
//         db.close();
//     });
});