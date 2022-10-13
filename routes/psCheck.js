const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

router.post('/:id', async (req, res, next) => {
  // const user = {}
      try {
      const { id, inputPassword } = req.body;  // 입력받은 이메일과 비밀번호가 담겨 있음.
      console.log(id, inputPassword)
      const user = await User.findOne({ where: { id } });
    if (!user) {
      res.status(404).send(' 유저정보가 일치하지 않습니다')
    }
    const boolean =  await bcrypt.compare(inputPassword, user.password);
    console.log(boolean)
   
    if(boolean) {
    
    // console.log(token);
    return res.status(200).json({
      message: '인풋값이 정상입니다',
      boolean,
    });
  }else{
    res.status(403).send('비밀번호를 확인해주세요!');
  }
  } catch (error) {
    console.error(error);
    return next(error);
  }
});








module.exports = router;