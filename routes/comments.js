var express = require('express');
var router = express.Router();

var Post = require('../models/Post');

router.post('/write/:id', (req, res) => {
    Post.findOne({_id : req.params.id},(err, post) => {
        if(err) throw err
        var comment = req.body;
        console.log(comment);
        post.comments.push(comment);
        post.save((err) => {
            if(err) throw err;
            res.redirect('/posts/view/'+req.params.id);            
        });
    });
});

router.get('/delete/:postId/:commentId', (req, res) => {
    Post.findOne({_id : req.params.postId}, (err, post) => {
        if(err) throw err;
        post.comments.pull({_id : req.params.commentId});
        post.save((err) => {
            if(err) throw err;
            res.redirect('/posts/view/' + req.params.postId);
        });
    });
});

module.exports = router;