var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//express的消息提示中间件,用于传递登录失败的一些信息
var flash = require('express-flash');
//passport
var passport = require('passport');
//passport本地验证策略
//详情可以看官网
//http://passportjs.org/
var LocalStrategy = require('passport-local').Strategy;


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//这里周期只设置为20秒，为了方便测试
//secret在正式用的时候务必修改
//express中间件顺序要和下面一致
app.use(session({secret: 'zhoulijie', cookie: { maxAge: 20000 }}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/**
 * 本地验证，这里我用固定的账号密码
 * 如果你有条件，可以替换为你的MongoDB之类的数据库查询
 * DEMO的话passport官网有写，链接http://passportjs.org/docs
 */
passport.use('local', new LocalStrategy(
    function(username, password, done) {
        var user = {
            id: '1',
            username: 'admin',
            password: '123456'
        };

        if (username !== user.username) {
            return done(null, false, { message: '请正确输入用户名' });
        }
        if (password !== user.password) {
            return done(null, false, { message: '请正确输入密码' });
        }

        return done(null, user);
    }
));
//保存user对象
passport.serializeUser(function (user, done) {
    done(null, user);
});
//删除user对象
passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
