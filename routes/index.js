var express = require('express');
var router = express.Router();

var Post = require('../models/Post');
var Category = require('../models/Category');
/* GET home page. */
router.get('/', function(req, res, next) {
  Post.find({}, (err, posts) => {
    if(err) console.log(err.stack);
      res.render('index', {
        postList : posts,
        user : req.user,
        isLast : false,
        pageNum : 0
    });
  }).sort({ date: -1 }).skip(0 * 5).limit(5);
});


module.exports = router;
