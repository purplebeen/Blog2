var express = require('express');
var router = express.Router();

var User = require('../models/User');
router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    if(req.body.password == req.body.password2) {
        var newUser = new User(req.body);
        newUser.save();
        res.send('Hello ' + req.body.userName);
    } else {
        res.send('<script>alert("비밀번호를 확인해 주세요"); window.location.href="/users/register";</script>');
    }
})

module.exports = router;