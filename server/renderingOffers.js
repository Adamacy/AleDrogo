const express = require("express");
const router = express.Router();
const path = require('path');
const { ObjectId } = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://Adamacy:NieInterere123@cluster0.x41no.mongodb.net/AleDrogo?retryWrites=true&w=majority"
router.get("/" , function(req, res){
    res.sendFile(path.join(__dirname
        +'/index.html'));
})
router.get('/offers', function(req, res){
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db){
        if (err) throw err
        let dbo = db.db('mydb');
        dbo.collection('offers').find({}).toArray(function(err, response){
            if (err) throw err
            res.render('miniOffer', {'response':JSON.stringify(response)})
        })
    })
})
router.get('/offer/:code', function(req,res){
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db){
        if (err) throw err
        let dbo = db.db('mydb');
        dbo.collection('offers').findOne({'_id':ObjectId(req.params.code)}, function(err, response){
            if (err) throw err;
            res.render('offer', {'response': response})
        })
    })
})
module.exports = {
    'router': router
}