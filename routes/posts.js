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
        Category.find({}, (err,categories) => {
            res.render('form', {
                formUrl : '/posts/write',
                userId : req.user.id,
                user: req.user,
                isEdit : false,
                categoryList : categories
            });
        });
    } else {
        res.send('<script>alert("로그인해주세요!"); window.location.href="/users/login";</script>')
    }
});

router.get('/view/:id', (req, res) => {
    Post.findOne({_id : req.params.id }, (err, post) => {
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

router.get('/:id/delete', (req, res) => {
    Post.findOne({_id : req.params.id}, (err, post) => {
        if(err) console.log(err)
        post.remove();
        res.redirect('/');        
    });
});

router.get('/:id/edit', (req, res) => {
    Post.findOne({_id : req.params.id}, (err, post) => {
        Category.find({}, (err, categories) => {
            res.render('form',{
                post : post,
                formUrl : '/posts/' + req.params.id + '/edit/',
                user : req.user,
                isEdit : true,
                categoryList : categories
            });
        });
    });
});

router.post('/:id/edit', (req, res) => {
    Post.update({_id : req.params.id}, req.body, (err, raw) => console.log(err));
    res.redirect('/posts/view/' + req.params.id);
});

router.get('/pages/:pageNum', (req, res) => {
    Post.find({}, (err, posts) => {
        Post.count((err, count) => {
            var pageNum = parseInt(req.params.pageNum);
            var isLast;
            if((parseInt(count / 5)) == pageNum)
                isLast = true;
            else
                isLast = false;
            console.log(parseInt(count / 5));
            res.render('index', {
                postList : posts,
                user : req.user,
                pageNum : pageNum,
                isLast : isLast        
            });
        })
       
    }).sort({date : -1}).skip(parseInt(req.params.pageNum) * 5).limit(5);
});
module.exports = router;