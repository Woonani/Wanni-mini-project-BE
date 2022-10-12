const jwt = require('jsonwebtoken');

const tokenUtil = {
    // ...(중간생략)...
    // 토큰 검증
    verifyToken(token) {
      try {
        const decoded = jwt.verify(token, secretKey);
  
        return decoded;
      } catch (err) {
        return null;
      }
    },
  };

  module.exports = tokenUtil;