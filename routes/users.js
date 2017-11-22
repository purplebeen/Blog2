var express = require('express');
var jwt = require('jsonwebtoken');

var config = require('../config/config');

var router = express.Router();

var User = require('../models/User');
var Category = require('../models/Category');
router.get('/login', (req, res) => {
    res.render('login', {
        user : req.user
    });
});

router.post('/login', (req, res) => {
    User.findOne({id : req.body.id}, (err, user) => {
        if(err) throw err;
        if(user && user.password === req.body.password) {
            let payload = { userName: user.userName, id: user.id };
            res.cookie('token', jwt.sign(payload, config.salt, { algorithm: config.jwtAlgorithm }), {});
        }
        res.redirect('/');
    });
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

router.get('/register', (req, res) => {
    Category.find({}, (err, categories) => {
        res.render('register', {
            user : req.user
        });
    });
});

router.post('/register', (req, res) => {
    if(req.body.password == req.body.password2) {
        var newUser = new User(req.body);
        newUser.save();
        res.redirect('/users/login');
    } else {
        res.send('<script>alert("비밀번호를 확인해 주세요"); window.location.href="/users/register";</script>');
    }
});

module.exports = router;