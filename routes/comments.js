var express = require('express');
var router = express.Router();

var Post = require('../models/Post');

router.post('/write/:postTitle', (req, res) => {
    Post.findOne({title : req.params.postTitle},(err, post) => {
        if(err) throw err
        var comment = req.body;
        console.log(comment);
        post.comments.push(comment);
        post.save((err) => {
            if(err) throw err;
            res.redirect('/posts/view/'+req.params.postTitle);            
        });
    });
});

router.get('/delete/:postTitle/:commentId', (req, res) => {
    Post.findOne({title : req.params.postTitle}, (err, post) => {
        if(err) throw err;
        post.comments.pull({_id : req.params.commentId});
        post.save((err) => {
            if(err) throw err;
            res.redirect('/posts/view/' + req.params.postTitle);
        });
    });
});

module.exports = router;