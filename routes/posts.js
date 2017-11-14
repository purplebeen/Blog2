var express = require('express');
var router = express.Router();

var Post = require('../models/Post');

//index
router.get('/', (req, res) => {
    res.render('post');
});

router.get('/write', (req, res) => {
    var dateTime = new Date();
    res.render('form', {
        date : dateTime
    });
});

router.get('/view/:title', (req, res) => {
    Post.findOne({title : req.params.title }, (err, post) => {
        if(err) throw err;
        res.render('post', {post : post});
    });
});
router.post('/write', (req, res) => {
    var newPost = new Post(req.body);
    newPost.save();
    res.send(newPost.title + "의 포스팅이 완료되었습니다.");
});
module.exports = router;