var express = require('express');
var router = express.Router();

var Category = require('../models/Category');

router.get('/', (req, res) => {
    Category.find({}, (err, categories) => {
        res.render('about-me', {
            user : req.user,
            categoryList : categories
        });
    });
});

module.exports = router;