const express = require('express');
const router = express.Router();

const Category = require('../models/Category').Category;

router.get('/', (req, res) => {
    Category.find({}, (err, categories) => {
        res.render('about-me', {
            user : req.user,
            categoryList : categories
        });
    });
});

module.exports = router;