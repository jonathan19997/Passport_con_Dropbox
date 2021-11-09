var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var app = express();
const passport = require('passport');
const session = require('express-session');
const  dropboxStrategy = require('passport-dropbox-oauth2').Strategy;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

/*app.use(passport.initialize());
app.use(passport.session());
app.use(session({secret: "daigual"}));*/

passport.use(new dropboxStrategy({
  
  clientID: 'l9ia0jjx64oui8s',
  clientSecret: 'iayuep30iubvzqb',
  callbackURL: "http://localhost:3000/hw/dropbox/getinfo"
},
function(token, refreshToken, profile, done) {
   /*User.findOrCreate({ providerId: profile.id }, function (err, user) {
      return done(err, user);
    });*/
    console.log(profile);
    return done(null, profile);
}
));

app.get('/hw/dropbox/getinfo', (req, res, next) =>{
  res.status(200).json({"msg":"Eureka, funciona. Autentificacion con passport-dropbox"});
});

app.get('/hw/dropbox/error', (req, res, next) =>{
  res.status(200).json({"msg":"Usuario no autentificado"});
});

app.get('/auth/dropbox',
  passport.authenticate('dropbox-oauth2',{scope:'email'}));

app.get('/auth/dropbox/callback', 
  passport.authenticate('dropbox-oauth2',{ successRedirect: 'http://localhost:3000/hw/dropbox/getinfo', failureRedirect: 'http://localhost:3000/hw/dropbox/error' })
);

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(id, done){
  done(null, id);
});



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
