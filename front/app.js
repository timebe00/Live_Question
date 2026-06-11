var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const common = require('./common/common');

var app = express();

setApp = () => {
  return new Promise(
    async (resolve, reject) => {
      try {
        global._base = __dirname;
        global._ServiceType = process.env.ServiceType || 'production';
        global._props = require(__dirname + '/config/' + _ServiceType + '/property.js');

        global._mybatisMapper = require('mybatis-mapper');

        var indexRouter = require('./routes/index');
        var usersRouter = require('./routes/users');

        // view engine setup
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');

        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, 'public')));

        app.use('/', indexRouter);
        app.use('/users', usersRouter);

        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
          next(createError(404));
        });

        // error handler
        app.use(function(err, req, res, next) {
          if (err.code === -99) {
            common.clearLoginCookies(res);
            return res.redirect('/');
          }

          res.locals.message = err.message;
          res.locals.status = err.status || 500;
          res.locals.error = req.app.get('env') === 'development' ? err : {};

          res.status(err.status || 500);
          res.render('error');
        });

        resolve(app);
      }
      catch (error) {
        console.log("error : ", error)
        reject(error);
      }
    }
  )
};

module.exports = setApp();
