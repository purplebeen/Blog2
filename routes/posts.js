var express = require('express');
var hljs = require('highlight.js');
var md = require('markdown-it')({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                        hljs.highlight(lang, str, true).value +
                        '</code></pre>';
            } catch (__) {}
        }

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});

var router = express.Router();
var Post = require('../models/Post');
var Category = require('../models/Category');

router.get('/write', (req, res) => {
    if(req.user) {
        res.render('form', {
            formUrl : '/posts/write',
            userId : req.user.id,
            user: req.user,
            isEdit : false
        });
    } else {
        res.send('<script>alert("로그인해주세요!"); window.location.href="/users/login";</script>')
    }
});

router.get('/view/:title', (req, res) => {
    Post.findOne({title : req.params.title }, (err, post) => {
        if(err) throw err;
        res.render('post', {
            post : post, 
            md: md,
            user : req.user        
        });
    });
});

router.post('/write', (req, res) => {
    Post.create(req.body, (err, post) => {
        console.log(err);
        console.log(post);
    })
    res.redirect('/');
});

router.get('/:title/delete', (req, res) => {
    Post.findOne({title : req.params.title}, (err, post) => {
        if(err) console.log(err)
        post.remove();
        res.redirect('/');        
    });
});

router.get('/:title/edit', (req, res) => {
    Post.findOne({title : req.params.title}, (err, post) => {
        res.render('form',{
            post : post,
            formUrl : '/posts/' + req.params.title + '/edit/',
            user : req.user,
            isEdit : true,
        });
    });
});

router.post('/:title/edit', (req, res) => {
    Post.update({title : req.body.title}, req.body, (err, raw) => console.log(raw));
    res.redirect('/posts/view/' + req.params.title);
});

router.get('/pages/:pageNum', (req, res) => {
    Post.find({}, (err, posts) => {
        if(req.params.pageNum == posts.length)
            var isLast = true;
        else
            var isLast = false;
        res.render('index', {
            postList : posts,
            user : req.user,
            pageNum : req.params.pageNum,
            isLast : isLast        
        });
    }).sort({date : -1}).skip(parseInt(req.params.pageNum) * 5).limit(5);
});
module.exports = router;