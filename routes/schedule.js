const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken'); //*중요!
const bcrypt = require('bcrypt');
const { verifyToken } = require('../library/middlewares');
const { Schedule, Student, User } = require('../models')
const ErrorResponse = require('../utils/errorResponse')

// 스케줄 생성
router.post('/:id', verifyToken, async (req, res, next) => {
    // const { lessonDate,stuName,attendTime,createdAt,studentId } = req.body;
    const { lessonDate, stuList } = req.body;
    try {
        let stuListData = stuList.split(",")
        console.log(stuListData)
        let ScheduleData = []

        for(i=0; i<stuListData.length; i++){

        console.log(stuListData[i])

        ScheduleData.push(await Schedule.create({
                lessonDate,
                stuName :  stuListData[i],
                attendTime : null,
                teachId: req.params.id,
                // studentId
            })
        )
        
    }
    return res.status(201).json({
        message: "success",
        data : ScheduleData,
    })      
    
  
    } catch (error) {
      console.error('error' , error);
      return next(error);
    }
    });






    
module.exports = router;
