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
    //   const exSchedule= await Schedule.findOne( {where: { stuName: req.body.stuName } });
      if(!exSchedule){
        await Schedule.create({
            lessonDate,
            stuName,
            attendTime,
            createdAt,
            teachId: req.params.id,
            studentId
        });
        res.status(201).json({
            message: "success",
            data : exSchedule,
        })      
      } else {
        res.status(301).json({ success : '등록 성공', data : exSchedule, }) 
      }
  
    } catch (error) {
      console.error('error' , exSchedule, error);
      return next(error);
    }
    });


module.exports = router;
