const express = require("express");
const router = express.Router()
const path = require('path');
const { ObjectId } = require('mongodb');
const mongo = require('mongodb');
const bcrypt = require('bcrypt');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const saltRounds = 10
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://Adamacy:NieInterere123@cluster0.x41no.mongodb.net/AleDrogo?retryWrites=true&w=majority"
// mongodb+srv://Adamacy:NieInterere123@cluster0.x41no.mongodb.net/test
router.get("/" , function(req, res){
    res.sendFile(path.join(__dirname
        +'/index.html'));
})
router.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login' }));

passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
            MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db){
            if (err) { return done(err);}
            let dbo = db.db('mydb');
            dbo.collection('users').findOne({'email':email}, function(err, response){
                if (err) throw err
                if (response == null){
                    return done(null, false, {'message': 'Niepoprawny e-mail lub hasło'})
                }
                
                bcrypt.compare(password, response.password, function(err, result){
                    if (err) throw err
                    if (result == true){
                        return done(null, {'email': response.email, 'id': response._id})
                    }
                    else{
                        return done(null, false, {'message': 'Niepoprawny e-mail lub hasło'})
                    }
                })
            })
        });
    }
));
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
passport.deserializeUser(function(id, done){
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db){
        if (err) throw err
        var dbo = db.db('mydb')
        dbo.collection('users').findOne({_id:ObjectId(id)}, function(err, response){
            if (err) throw err
            done(null, {'email': response.email, 'id': response._id})
        })
    })
})

router.post('/registration', function(req, res){
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db){
        if (err) throw err
        let dbo = db.db('mydb');
        bcrypt.hash(req.body.password, saltRounds, function(err, hash){
            if (err) throw err
            dbo.collection('users').insertOne({'username':req.body.username, 'email':req.body.email, 'password': hash}, function(err){
                if (err) throw err
                res.sendStatus(201)
            })
        })
    })
})

router.get('/islogedin', function(req,res){
    res.json(req.user)
})
module.exports = {
    'router': router,
    'passport': passport
}