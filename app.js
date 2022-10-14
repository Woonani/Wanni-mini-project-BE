//라이브러리 선언
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv'); 
const cors = require('cors');

dotenv.config(); 

// 라우터 연결
const indexRouter = require('./routes');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const pwCheckRouter = require('./routes/pwCheck');
// const commentsRouter = require('./routes/students');
//
const app = express();
app.set('port', process.env.PORT || 3001);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

// 1. 시퀄라이즈 모델이 삽입된 DB 객체 (db ={ sequelize : sequelize })
const { sequelize } = require('./models');

// 2. **앱이 구동될 때** 시퀄라이즈 데이터베이스랑 연결 확인 (커넥션을 만든다.) 
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

// 미들웨어
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// 라우터 미들웨어 등록
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);

app.use('/pwCheck', pwCheckRouter);

// app.use('/comments', commentsRouter);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
