const express = require("express");
const router = express.Router()
const path = require('path');
const mongo = require('mongodb');
const bcrypt = require('bcrypt');
const passport = require("passport");
const saltRounds = 10
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://Adamacy:NoweHaslo123@cluster0.x41no.mongodb.net/AleDrogo?retryWrites=true&w=majority"

router.get("/" , function(req, res){
    res.sendFile(path.join(__dirname
        +'/index.html'));
})
module.exports = {
    'router': router
}