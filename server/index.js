const express = require("express");
const app = express();
const path = require('path');
const bodyParser = require('body-parser')
const passport = require("passport");
const database = require('./Database.js')
const session = require('express-session')
const mongoStore = require('connect-mongo')(session)
const user = require('./user.js')
const creatingOffer = require('./creatingOffer')
const renderingOffer = require('./renderingOffers.js')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://Adamacy:NoweHaslo123@cluster0.x41no.mongodb.net/AleDrogo?retryWrites=true&w=majority"

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Making folder public to folder with all public files
app.use('/public', express.static(path.join(__dirname, 'public')));
// Session for loged in users
app.use(session({
        secret: 'JYUHMKGyhjugmk66ujh7U6hju6tumUMu6JHU6Mhjynmughjymnu6',
        resave: false,
        saveUninitialized: false,
        cookie: {secure: false, path: "/", maxAge: 24 * 60 * 60 * 1000000},
        store: new mongoStore({'url': url, 'dbName': 'mydb'})
    }))
// Path for main server file
app.get('*', function(req, res){
    res.sendFile('./public/index.html', {root: __dirname})
})

// Loading sessions
app.use(passport.initialize());
app.use(passport.session());

// Assigninging all files to main file
app.use('/', database.router)
app.use('/', user.router)
app.use('/', renderingOffer.router)
app.use('/', creatingOffer.router)
app.set('view engine', 'pug')

// Starting server
app.listen(process.env.PORT || 8080)