const express = require("express");
const router = express.Router();
const path = require('path');
const mongo = require('mongodb');
const bcrypt = require('bcrypt');
const passport = require("passport");
const bodyParser = require('body-parser');
const saltRounds = 10
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://Adamacy:NieInterere123@cluster0.x41no.mongodb.net/AleDrogo?retryWrites=true&w=majority"

router.get("/" , function(req, res){
    res.sendFile(path.join(__dirname
        +'/index.html'));
})
var offer = {
    'title': req.body.title,
    'description':req.body.description,
    'image':req.body.image
}
router.post('/offer', function(req, res){
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db){
        if (err) throw err
        let dbo = db.db('mydb')
        dbo.collection('users')
    })
})
module.exports = {
    'router': router
}