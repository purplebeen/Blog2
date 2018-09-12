const express = require('express');
const hljs = require('highlight.js');
const md = require('markdown-it')({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>';
            } catch (__) {
            }
        }

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    },
    breaks: true
}).use(require('markdown-it-video', {
    youtube: {width: 640, height: 390},
    vimeo: {width: 500, height: 281},
    vine: {width: 600, height: 600, embed: 'simple'},
    prezi: {width: 550, height: 400}
}));;

const router = express.Router();
const Post = require('../models/Post').Post;
const Category = require('../models/Category').Category;

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
        Category.find({}, (err, categories) => {
            if(err) throw err;
            res.render('post', {
                post : post,
                md: md,
                user : req.user,
                categoryList : categories
            });
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
            Category.find({}, (err, categories) => {
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
                    isLast : isLast,
                    categoryList : categories
                });
            });
        });
    }).sort({date : -1}).skip(parseInt(req.params.pageNum) * 5).limit(5);
});
module.exports = router;