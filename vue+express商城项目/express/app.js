var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var Goods = require('./models/goods');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var index = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {
  if(req.cookies.userId){
    next();
  }else{
//    console.log("url:"+req.originalUrl,req.path);
      if(req.originalUrl=='/users/login' || req.originalUrl=='/users/logout' || req.path.indexOf('/goods/index')>-1){
          next();
      }else{
          res.json({
            status:'101',
            msg:'您还未登录，请登录！',
            result:''
          });
      }
  }
});

app.use('/', index);
app.use('/users', users);
app.use('/goods',goods);

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

//连接MongoDB数据库
mongoose.connect('mongodb://localhost:27017/dumall',{useMongoClient:true},(err)=> {
    if(err){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功'); 
    }
})
module.exports = app;
