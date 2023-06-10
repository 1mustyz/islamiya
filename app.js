var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const authRoutes = require("./routers/authRoutes");
const uploadRouters = require("./routers/uploadImageRoutes");
const OpenAIRoutes = require("./routers/openaiRoutes");
const cors = require('cors')
require('dotenv').config()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


// //connect to db
mongoose.connect('mongodb+srv://1mustyz:z08135696959@gift.qtxnh.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true
})
mongoose.Promise = global.Promise

// test DB connection
var conn = mongoose.connection
  .once('open', () => {
    console.log('mongodb started')
    
    
    // connect the server if DB is UP
    // http.listen(PORT, () => {
    //   console.log(`server started `)
    // })
  })
  .on('error', (error) => {
    console.log('error occured:', error)
  })



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use(authRoutes);
app.use(uploadRouters);
app.use(OpenAIRoutes);

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
