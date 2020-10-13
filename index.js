const express = require("express");
const app = express();
const path = require('path');
const mongo = require('mongodb');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const { readSync } = require("fs");
const passport = require("passport");
const database = require('./Database.js')
const session = require('express-session')
const mongoStore = require('connect-mongo')(session)
const user = require('./user.js')
const saltRounds = 10
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://Adamacy:NieInterere123@cluster0.x41no.mongodb.net/AleDrogo?retryWrites=true&w=majority"

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(session({
        secret: 'JYUHMKGyhjugmk66ujh7U6hju6tumUMu6JHU6Mhjynmughjymnu6',
        resave: false,
        saveUninitialized: false,
        cookie: {secure: false, path: "/", maxAge: 24 * 60 * 60 * 1000000},
        store: new mongoStore({'url': url, 'dbName': 'mydb'})
    }))

app.use(passport.initialize());
app.use(passport.session());

app.use('/', database.router)
app.use('/', user.router)

app.listen(process.env.PORT || 8080)