var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//~Requiring non-predefined middlewares
var config = require('./config');
const mongoose = require('mongoose');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var cors = require('cors')


var indexRouter = require('./routes/index');
var cropsRouter = require('./routes/crops');
var usersRouter = require('./routes/users');
var farmerRouter = require('./routes/farmers');
var vendorRouter = require('./routes/vendors');
var cropOrderRouter = require('./routes/crop_orders');
var cropOrderRouterUser = require('./routes/crop_orders_users');
var cropPosted = require('./routes/crop_posted');
var vendorProds = require('./routes/vendor_prods');

//~Connecting to the server
const url = config.mongoUrl;
const connect = mongoose.connect(url, { useNewUrlParser: true });
connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//~Configuring the Sessions Authorization (Use with Sessions)
/*
app.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: false,
    resave: false,
    store: new FileStore()
}));
*/


//~Initializing Passport
app.use(passport.initialize());
//app.use(passport.session());


//~Access Points
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/crops', cropsRouter);
app.use('/farmers', farmerRouter);
app.use('/vendors', vendorRouter);
app.use('/corders', cropOrderRouter);
app.use('/corders_users', cropOrderRouterUser);
app.use('/cposted', cropPosted);
app.use('/vprods', vendorProds);

//~Authorization function (Use with Sessions)
/*
function auth (req, res, next) {
    console.log(req.user);

    if (!req.user) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        next(err);
    }
    else {
        next();
    }
}

app.use(auth);
*/

// access the public folder
app.use(express.static(path.join(__dirname, 'public')));

//~Go on adding routes to this list

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
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