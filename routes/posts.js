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

//index
router.get('/', (req, res) => {
    res.render('post');
});

router.get('/write', (req, res) => {
    if(req.user) {
        var dateTime = new Date();
        res.render('form', {
            date : dateTime,
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
            isEdit : true
        });
    })
});

router.post('/:title/edit', (req, res) => {
    Post.update({title : req.body.title}, req.body, (err, raw) => console.log(raw));
    res.redirect('/posts/view/' + req.params.title);
})

module.exports = router;