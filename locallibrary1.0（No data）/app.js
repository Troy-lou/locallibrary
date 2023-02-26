var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');  // 导入 catalog 路由

var compression = require('compression');//压缩发送回客户端的 HTTP 响应
var helmet = require('helmet');//设置适当的 HTTP 标头,免除常见web漏洞影响

var app = express();

// 设置 Mongoose 连接
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = 'mongodb+srv://locallibrary:IbvHeLaSuEUHMcn0@locallibrary.r1aimmr.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('connected', function () {
  console.log('mongodb数据库连接成功！连接地址是：' + mongoDB)
})
db.on('error', console.error.bind(console, 'MongoDB 连接错误：'));

// const mongoose = require('mongoose');
// mongoose.set('strictQuery', false);
// const dev_db_url = 'mmongodb+srv://<username>:<password>@locallibrary.n6uzsvg.mongodb.net/?retryWrites=true&w=majority';
// const mongoDB = process.env.MONGODB_URI || dev_db_url;

// main().catch(err => console.log(err));
// async function main() {
//   await mongoose.connect(mongoDB);
// }



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(compression()); 
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);  // 将 catalog 路由添加进中间件链

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
