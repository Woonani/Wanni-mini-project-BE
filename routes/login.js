const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken'); //*중요!
const ErrorResponse = require('../utils/errorResponse')


const router = express.Router();

router.post('/', async (req, res, next) => {
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
router.route('/me')
  .post(async (req, res, next) => {
    // 토큰 받아오기
    //2. 토큰 id 구하기
    //3. 토큰 id로 유저정보 찾기
    //4. 유저정보 프론트에 주기
    const user = req.user
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
    
    res.status(200).json({ success: true, data: user })
  } catch (err) {
    console.log(err)
    return next(new ErrorResponse('Not authorized to access this route', 401))
  }
} ) 

// router.post('/login', isNotLoggedIn, (req, res, next) => {
//   passport.authenticate('local', (authError, user, info) => {
//     if (authError) {
//       console.error(authError);
//       return next(authError);
//     }
//     if (!user) {
//         res.status(403).send('로그인에 실패했습니다.');
//     }
//     return req.login(user, (loginError) => {
//       if (loginError) {
//         console.error(loginError);
//         return next(loginError);
//       }
//       return res.redirect('/');
//     });
//   })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
// });







module.exports = router;