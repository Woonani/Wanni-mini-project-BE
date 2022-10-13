//회원가입과 student 입력이 같이 있음
const express = require('express');
const User = require('../models/user');
const Student = require('../models/student');
const { verifyToken } = require('../library/middlewares')

const router = express.Router();

router.get('/:id', verifyToken, async (req, res, next) => {
  const user = {}
  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // user.data = await User.findByPk(req.params.id)


    req.user  = await User.findByPk(req.params.id)

    user.id = req.user.dataValues.id
    user.email = req.user.dataValues.email
    user.name = req.user.dataValues.name
    user.className = req.user.dataValues.className
    user.phoneNum = req.user.dataValues.phoneNum
    user.password = req.user.dataValues.password

    console.log(user);
    res.status(200).json({ success: true, data: user })
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// router.route('/me/')
//   .post(async (req, res, next) => {
//     // 토큰 받아오기
//     //2. 토큰 id 구하기
//     //3. 토큰 id로 유저정보 찾기
//     //4. 유저정보 프론트에 주기
//     const user = req.user
//     let token

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1]
//   }
//   if (!token) {
//     return next(new ErrorResponse('Not authorized to access this route', 401))
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET)

//     req.user = await User.findOne(decoded.id)
    
//     res.status(200).json({ success: true, data: user })
//   } catch (err) {
//     return next(new ErrorResponse('Not authorized to access this route', 401))
//   }
// } ) 
   
     
    

  // .post(async (req, res, next) => {
  //   try {
  //     const user = req.body
  //     console.log(user)
      // await User.create({
        
        // age: req.body.age,
        // married: req.body.married,
      // });
      // console.log(user);
      // res.status(201).json(user);
  //   } catch (err) {
  //     console.error(err);
  //     console.log(user)
  //     next(err);
  //   }
  // });
  // router.patch('/:userId', verifyToken, async (req, res, next) => {
  //   try {
  //     const {password, name, className, phoneNum} = req.body;

  //     console.log(password, name, className, phoneNum)

  //     const updatedCount = 
  //     await User.update({ 
  //       password,
  //       name, 
  //       className, 
  //       phoneNum },
  //       { where: {id: req.params.userId }}); // 포스트맨 확인하려고 req.decoded.id 를 req.body.id로 바꿈
        
  //     console.log("updatedCount",updatedCount)
  //     res.json({
  //       code: 200,
  //       message: `수정됐습니다 : ${req.body.password} ${req.body.name} ${req.body.className} ${req.body.phoneNum}`,
  //     });
  //   } catch(error) {
  //     console.error(error);
  //     next(error);
  //   }
  // })
router.get('/:id/students', async (req, res, next) => {
  try {
    const students = await Student.findAll({
      include: {
        model: User,
        where: { id: req.params.id },
      },
    });
    console.log(students);
    res.json(students);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
