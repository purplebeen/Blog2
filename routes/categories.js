const express = require('express');
const router = express.Router();
const Category = require('../models/Category').Category;
const Post = require('../models/Post').Post;

router.post('/add', (req, res) => {
    console.log(req.body);
    Category.create(req.body, (err,category) => {
        if(err) throw err;
        res.send('<script>alert("성공적으로 생성되었습니다!");location.href="/posts/write"</script>');
    });
});

router.get('/:categoryName', (req, res) => {
    Post.find({category : req.params.categoryName}, (err, posts) => {
        Category.find({}, (err, categories) => {
            res.render('index', {
                postList : posts,
                user : req.user,
                isLast : true,
                pageNum : 0,
                categoryList : categories
            });
        });
    }).sort({date : -1});
});

module.exports = router;