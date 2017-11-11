var express = require('express');
var router = express.Router();

//index
router.get('/', (req, res) => {
    res.render('post');
});

module.exports = router;