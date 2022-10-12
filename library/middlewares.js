const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.verifyToken = async (req, res, next) => {
  try {
    console.log('headers.authorization',req.headers.authorization);
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
    const isUser = await User.findOne({where: {id: req.decoded.id}})
    
    console.log("req.decoded.id",req.decoded.id)
    console.log("isUser",isUser)
    if(isUser.deletedAt !== null){
      return res.status(400).json({
        message: "이미 탈퇴한 유저입니다." 
      })
    }
    return next()
  } 
  catch(error) {
    console.log("error", error)
    
    if(error.name === 'TokenExpiredError') {

      return res.status(419).json({code: 419,message: '토큰이 만료되었습니다',});
    }
    return res.status(401).json({code: 401,message: '유효하지 않은 토큰입니다',})
  }
}
