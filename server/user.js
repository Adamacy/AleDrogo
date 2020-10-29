const express = require("express");
const router = express.Router()
const path = require('path');
const { ObjectId } = require('mongodb');
const mongo = require('mongodb');
const bcrypt = require('bcrypt');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const saltRounds = 10
const nodemailer = require('nodemailer');
const { response } = require("express");
var MongoClient = require('mongodb').MongoClient;
var code = generateRandomString(6)
var url = "mongodb+srv://Adamacy:NieInterere123@cluster0.x41no.mongodb.net/AleDrogo?retryWrites=true&w=majority"
// mongodb+srv://Adamacy:NieInterere123@cluster0.x41no.mongodb.net/test
var transporter = nodemailer.createTransport({
    'service': 'gmail',
    auth: {
        user: 'pythonislove2137@gmail.com',
        pass: 'PythonLove2137'
    }
});
function generateRandomString(length) {
    let result = '';
    let characters = '0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
router.get("/" , function(req, res){
    res.sendFile(path.join(__dirname
        +'/index.html'));
});
// Sign in to ALeDrogo
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
// session
passport.serializeUser(function(user, done){
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
// Registering user into database
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
            dbo.collection('codes').insertOne({'email': req.body.email, 'code': code})
        })
    })
})
// Password reseting system
router.post('/forgotpassword', function(req, res){
    var forgotemail = req.body.forgotemail
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db){
        if (err) throw err
        let dbo = db.db('mydb')
        dbo.collection('codes').updateOne({'email': req.body.forgotemail}, {$set: {'code': code}}, function(err, response){
            if (err) throw err
            var mailOptions = {
                from: 'pythonislove2137@gmail.com',
                to: forgotemail,
                subject: 'Reset hasła AleDrogo',
                text: `Jeśli czytasz tego maila prawdopodobnie zapomniałeś hasła. Wpisz ${code} kod na stronie, aby móc zresetować hasło.`
            }
            console.log(code)
            if(req.body.code != null){
                res.sendStatus(200)
            }
            console.log(req.body.code)
            if(response == null){
                res.sendStatus(404)
                return false
            }
            if(response != null){
                res.redirect('/public/forgotpassword/forgotpassword2.html')
            }
            transporter.sendMail(mailOptions, function(err, info){
                if (err) throw err
                console.log(info)
            })
        })
    })
})
router.post('/forgotpassword2', function(req, res){
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db){
        if (err) throw err
        let dbo = db.db('mydb')
        dbo.collection('codes').findOne({'code': req.body.code}, function(err, response){
            if (err) throw err
            if(response != null){
                res.redirect('/public/forgotpassword/forgotpassword3.html')
            }
            if(response == null){
                res.sendStatus(400)
            }
        })
    })
})
router.post('/forgotpassword3', function(req, res){
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db){
        if (err) throw err
        let dbo = db.db('mydb')
        var forgotemail = req.body.forgotemail
        console.log(forgotemail)
        var password = bcrypt.hash(req.body.newpassword, saltRounds)
        dbo.collection('users').updateOne({'email': forgotemail}, {$set: {'password': password}}, function(err, response){
            if (err) throw err
            if(response != null){
                console.log('Password Changed')
                res.sendStatus(201)
            }
            if(response == null){
                console.log('Error')
                res.sendStatus(404)
            }
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