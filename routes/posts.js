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
    var dateTime = new Date();
    res.render('form', {
        date : dateTime
    });
});

router.get('/view/:title', (req, res) => {
    Post.findOne({title : req.params.title }, (err, post) => {
        if(err) throw err;
        res.render('post', {post : post, md: md});
    });
});

router.post('/write', (req, res) => {
    var newPost = new Post(req.body);
    newPost.save();
    res.redirect('/');
});
module.exports = router;