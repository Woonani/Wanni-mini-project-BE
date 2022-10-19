//해봄
const { sequelize } = require('./connection');


// 2-1. 시퀄라이즈 선언
// const Sequelize = require('sequelize');


// 1-1. 앱 환경 설정
const env = process.env.NODE_ENV || 'development';
// 1-2. 환경별로 설정(개발환경 따로 배포환경 따로 옵션 설정)
const config = require('../config/config.json')[env];

// 빈 객체 생성
const db = {};

// 2-2. 시퀄라이즈 연결 설정
// const sequelize = new Sequelize(config.database, config.username, config.password, config);

// 연결설정 된 시퀄라이즈 : 생성자로써 연결설정까지 넣은것을 소문자에 넣음 - config설정까지 한 거.
db.sequelize = sequelize;
// 연결설정 안 된 시퀄라이즈 : 라이브러리 자체를 넣음 - 쓰는건 없는 convention (관습적으로 쓰는 원본 느낌)
// db.Sequelize = Sequelize;

// 외부입력??? -> 맵핑된 테이블 모델 가져오기 (Object relation mapping)
const User = require('./user');
const Student = require('./student');
const Timetable = require('./timetable');
const Schedule = require('./schedule');
const Comment = require('./comment');

// 디비객체에 모델 몰아넣기
db.User = User;
db.Student = Student;
db.Timetable = Timetable;
db.Schedule = Schedule;
db.Comment = Comment;

// 시퀄라이즈 init 호출 (super.init)
User.init(sequelize);
Student.init(sequelize);
Timetable.init(sequelize);
Schedule.init(sequelize);
Comment.init(sequelize);

// 시퀄라이즈 hasMany 호출
User.associate(db);
Student.associate(db);
Timetable.associate(db);
Schedule.associate(db);
Comment.associate(db);

module.exports = db;
