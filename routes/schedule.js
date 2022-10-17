const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken'); //*중요!
const bcrypt = require('bcrypt');
const { verifyToken } = require('../library/middlewares');
const { Schedule, Student, User } = require('../models')
const ErrorResponse = require('../utils/errorResponse')

//스케줄 정보 등록 
router.post('/:id', verifyToken, async (req, res, next) => {
    const { lessonDate,stuName,attendTime,createdAt,teachId,studentId } = req.body;
    try {
      const exStudentA= await Student.findOne( {where: { stuName: req.body.stuName } });
      if(!exStudentA){
        await Student.create({
          stuName,
          stuGrade,
          school,
          phoneNum,
          etc,
          teachId: req.params.id
        });
        res.status(201).json({
            code: 201,
            message: "success"
        })      
      } else {
        res.status(301).send('이미 등록된 학생입니다.') 
      }
  
    } catch (error) {
      console.error(error);
      return next(error);
    }
    });


module.exports = router;
