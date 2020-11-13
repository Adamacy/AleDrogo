const express = require("express");
const router = express.Router();
const path = require('path');
const pug = require('pug')
const formidable = require('formidable')
const mongo = require('mongodb');
const fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://Adamacy:NoweHaslo123@cluster0.x41no.mongodb.net/AleDrogo?retryWrites=true&w=majority"

router.get("/" , function(req, res){
    res.sendFile(path.join(__dirname
        +'/index.html'));
})
router.post('/offer', function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        if (err) throw err
        let oldpath = files.image.path;
        let newpath = `C:/Users/ajaku/OneDrive/Dokumenty/AleDrogo/server/public/images/${files.image.name}`;
        fs.rename(oldpath, newpath, function(err){
            if (err) throw err
        })
    })
    let offerData = {
            'title': req.body.title,
            'description': req.body.description,
            'image': req.body.image,
            'category': req.body.category,
            'state': req.body.state,
            'cost': req.body.cost
        }
        console.log(offerData)
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db){
        if (err) throw err
        let dbo = db.db('mydb')
        dbo.collection('offers').insertOne(offerData, function(err, response){
            if (err) throw err
            if (response != null){
                res.sendStatus(200)
            }
            if(response == null){
                res.sendStatus(400)
            }
        })
    })
})
module.exports = {
    'router': router
}