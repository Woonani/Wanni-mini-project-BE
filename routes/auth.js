const express = require('express');
const bcrypt = require('bcrypt');
const { verifyToken } = require('../library/middlewares');
const User = require('../models/user');
const jwt = require('jsonwebtoken'); //*중요!
const ErrorResponse = require('../utils/errorResponse')


const router = express.Router();

//join  /auth/join
router.post('/join', async (req, res, next) => {
    const { email, name , password, className, phoneNum   } = req.body;
    try {
      const exUser = await User.findOne({ where: { email } });
      if (exUser) {
        res.status(403).send('이미 존재하는 email 입니다.');
      }else{
          const hash = await bcrypt.hash(password, 12);
          await User.create({
            email,
            name ,
            password: hash,
            className,
            phoneNum
          });
          res.status(201).json({
              code: 201,
              message: "success"
          })
      }
    } catch (error) {
      console.error(error);
      return next(error);
    }
  });

  //login    /auth/login
  router.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body;  // 입력받은 이메일과 비밀번호가 담겨 있음.
      const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).send(' 회원정보를 확인해주세요')
    }
    const hash =  await bcrypt.compare(password, user.password);
    if(hash){
    const token = jwt.sign({
      email,
      id: user.id,
    }, process.env.JWT_SECRET, {  //*중요!
      expiresIn: '3000m', // 3000분
      issuer: 'team',
    });
    console.log(token);
    return res.status(200).json({
      message: '토큰이 발급되었습니다',
      token,
    });
  }else{
    res.status(403).send('로그인 정보를 확인해주세요!');
  }
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// auth/login/me
router.route('/login/me')
  .post(async (req, res, next) => {
    // 1. 토큰 받아오기
    // 2. 토큰 id 구하기
    // 3. 토큰 id로 유저정보 찾기
    // 4. 유저정보 프론트에 주기
    const user = {}
    let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401))
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findByPk(decoded.id)
    // console.log(req.user)
    user.id = req.user.dataValues.id
    user.name = req.user.dataValues.name
    user.className = req.user.dataValues.className
    // user.password = req.user.dataValues.password
    // console.log(user)
    res.status(200).json({ success: true, data: user })
  } catch (err) {
    console.log(err)
    return next(new ErrorResponse('Not authorized to access this route', 401))
  }
} ) 
  
//edit /auth/:id
router.patch('/:id', verifyToken, async (req, res, next) => {
    try {
      const {password, name, className, phoneNum} = req.body;

      console.log(password, name, className, phoneNum)
      const hash = await bcrypt.hash(password, 12);
      const updatedCount = 
      await User.update({ 
        password: hash,
        name, 
        className, 
        phoneNum },
        { where: {id: req.params.id }}); // 포스트맨 확인하려고 req.decoded.id 를 req.body.id로 바꿈
        
      console.log("updatedCount",updatedCount)
      res.json({
        code: 200,
        message: `수정됐습니다 : ${req.body.password} ${req.body.name} ${req.body.className} ${req.body.phoneNum}`,
      });
    } catch(error) {
      console.error(error);
      next(error);
    }
  })

//delete  auth/:id
router.delete('/:id', verifyToken, async (req, res)=>{
    try {
      const deleteUser = await User.findOne({where: { id: req.decoded.id}}) // 포스트맨 확인하려고 req.decoded.id 를 req.body.id로 바꿈
      console.log('deleteUser: '+ deleteUser);
      if(deleteUser){
        await User.destroy({where: {id: deleteUser.id}});
        res.json({
            code: 200,
            message: ' 회원 탈퇴 성공!',
        })
      }else{
        res.status(400).send(" 삭제할 유저가 없습니다.")
      }
    } catch (error) {
      console.error(error);
    } 
    })

module.exports = router;

