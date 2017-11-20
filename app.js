var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');

var authentication = require('./utils/authentication');

//mongoose setting
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blog')
var db = mongoose.connection;
db.on('error', console.error)
  .once('open',() => {
    console.log('Connect to mongodb server');
  });

var index = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var aboutme = require('./routes/aboutme');
var comments = require('./routes/comments');
var categories = require('./routes/categories');

var app = express();

app.use(fileUpload());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(authentication);

app.use('/', index);
app.use('/users', users);
app.use('/posts', posts);
app.use('/aboutme', aboutme);
app.use('/comments', comments);
app.use('/categories', categories);

app.post('/files/upload', (req, res) => {
  req.files.aa.mv(`${__dirname}/public/images/${req.files.aa.name}`, (err) => {
    if(err) console.log(err);
    res.redirect(`/images/${req.files.aa.name}`);
  });
});

app.get('/files/upload', (req, res) => {
  res.render('upload');
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
