const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken'); //*중요!
const bcrypt = require('bcrypt');
const { verifyToken } = require('../library/middlewares');
const { Schedule, Student } = require('../models')
// const {  Student, User } = require('../models')
// const ErrorResponse = require('../utils/errorResponse')
const sequelize = require("sequelize")
const Op = sequelize.Op;



// CREATE : 출석부 생성
// 스케줄 정보 등록
// req.body => {
//     "lessonDate" : "2022/10/17/14:00:00",
//     "stuList" : "학생1,학생2,학생3"
// }
router.post('/:id', verifyToken, async (req, res, next) => {
    // const { lessonDate,stuName,attendTime,createdAt,studentId } = req.body;
    const { lessonDate, stuList } = req.body;
    try {
        let stuListData = stuList.split(",")
        console.log(stuListData)
        let ScheduleData = []

        for(i=0; i<stuListData.length; i++){

        // console.log(stuListData[i])
        let j = (await Student.findOne({
            attributes : ['id'],
            where : {
                teachId : req.params.id,
                stuName : stuListData[i] }
        }))
        // console.log("j : ", j)

        ScheduleData.push(await Schedule.create({
                lessonDate,
                stuName :  stuListData[i],
                attendTime : null,
                teachId: req.params.id,
                studentId : j.dataValues.id
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



// Read 1 - 출석부에 뿌려주기 
// GET schedule/:id/today
router.get('/:id/today', verifyToken, async (req, res, next) => {

    try {
        if(req.decoded.id == req.params.id){ 
            
            const { lessonDate } = req.body; 
            console.log(lessonDate)

            const todaySchedule = await Schedule.findAll({
                where : {
                    teachId : req.params.id, 
                    // 날짜 검색 일부만 도 가능
                    lessonDate : {[Op.like]: "%" + lessonDate + "%"}   
                }
                })
            if (todaySchedule){
                res.status(200).json({ success: true, data: todaySchedule })

            }else{ 

                res.status(401).json({message: '조회할 시간표가 없습니다.'})
            }
    
        }else{
            res.status(401).json({message: '토큰과 사용자가 일치하지 않습니다.'})//잘못된 접근데쓰네'})
        }
      
   
    } catch (err) {
  
      res.status(400).json({ success: false, message : '출석부(schedule)를 불러올 수 없습니다.'})

    }
  } ) 



// Read 2 - 히스토리에 뿌려주기 
router.get('/:id/history/:stuName', verifyToken, async (req, res, next) => {

    try {
        if(req.decoded.id == req.params.id){ 
            
            // const { lessonDate } = req.body; 
            // console.log(lessonDate)

            const historySchedule = await Schedule.findAll({
                where : {
                    teachId : req.params.id, 
                    stuName :  req.params.stuName
                    // lessonDate : {[Op.like]: "%" + lessonDate + "%"}   
                }
                })
            if (historySchedule){
                res.status(200).json({ success: true, data: historySchedule })

            }else{ 

                res.status(401).json({message: '조회할 히스토리가 없습니다.'})
            }
    
        }else{
            res.status(401).json({message: '토큰과 사용자가 일치하지 않습니다.'})//잘못된 접근데쓰네'})
        }
      
   
    } catch (err) {
  
      res.status(400).json({ success: false, message : '출석부(history)를 불러올 수 없습니다.'})

    }
  } ) 





// U attendence 추가하기
router.patch('/:userId/today/:scheId', verifyToken, async (req, res, next) => {
    try{
        if(req.decoded.id == req.params.userId){
            const { attendTime } = req.body;
            await Schedule.update({
                attendTime
            },
            {where: { //stuId: req.params.stuId,
                id : req.params.scheId
             }})
            res.json({
                code: 200,
                message: '출석시간 입력 완료 ',
              });

        }else{
            res.status(401).json({message: '토큰과 사용자가 일치하지 않습니다.'})//잘못된 접근데쓰네'})
        }

    }catch(error) {
        console.error(error);
        next(error);
      }
})





// D







module.exports = router;