var express = require('express');
var router = express.Router();

var Category = require('../models/Category');

router.get('/', (req, res) => {
    res.render('about-me', {
        user : req.user         
    });
});

module.exports = router;