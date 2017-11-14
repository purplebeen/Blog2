var express = require('express');
var router = express.Router();

var Post = require('../models/Post');
/* GET home page. */
router.get('/', function(req, res, next) {
  Post.find({}, (err, posts) => {
    if(err) console.log(err.stack);
    res.render('index', {
        postList : posts
      });
  });
});


module.exports = router;
