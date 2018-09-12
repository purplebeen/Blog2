const express = require('express');
const router = express.Router();

const Post = require('../models/Post').Post;
const Category = require('../models/Category').Category;

/* GET home page. */
router.get('/', function(req, res, next) {
  Post.find({}, (err, posts) => {
    if(err) console.log(err.stack);
    Category.find({}, (err, categories) => {
        res.render('index', {
            postList : posts,
            user : req.user,
            isLast : false,
            pageNum : 0,
            categoryList : categories
        });
    });
  }).sort({ date: -1 }).skip(0 * 5).limit(5);
});


module.exports = router;
