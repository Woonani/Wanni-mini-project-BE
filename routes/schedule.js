const express = require('express');
const router = express.Router();

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
        let j = await Student.findOne({
            attributes : ['id'],
            where : {
                teachId : req.params.id,
                stuName : stuListData[i] }
            })  
        // console.log("j야 놔와랏 : ", j,j.datavalues)

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
            const updateResult = await Schedule.update({
                attendTime
            },
            {where: { //stuId: req.params.stuId,
                id : req.params.scheId
             }})
            console.log(updateResult)
              if (updateResult >0){
                res.json({code: 200, message: '출석시간 입력 완료 ', });

            }else{ 
                res.status(401).json({message: '입력할 대상이 없습니다.'})
            }
        }else{
            res.status(401).json({message: '토큰과 사용자가 일치하지 않습니다.'})//잘못된 접근데쓰네'})
        }

    }catch(error) {
        res.status(400).json({ success: false, message : '출석 시간을 등록 할 수 없습니다.'})

      }
})





// Delete - 1.쌤 한분의 전체 출석부 삭제 : userId로 삭제
//  보류

// Delete - 2.쌤 한분의 특정 학생의 출석부 삭제 : userId, stuName 또는 stuId로 삭제
//  보류

// Delete - 3.쌤 한분의 특정 날짜의 출석부 삭제 : userId, lessonDate로 삭제
//delete  schedule/:id/date
router.delete('/:id/date', verifyToken, async (req, res)=>{
    
    try {   
        if(req.decoded.id == req.params.userId){

            const {deleteDate} = req.body       
            const deletedResult = await Schedule.destroy(
                {where: {
                    teachId: req.params.id, 
                    // 날짜 검색 일부만 도 가능
                    lessonDate : {[Op.like]: "%" + deleteDate + "%"} 
                }
                });
            console.log(deletedResult) // 삭제된 로우의 갯수가 나옴

            if(deletedResult>0){
                res.json({
                    code: 200,
                    message: '출석부 삭제 완료',
                })
            }else {
                res.status(400).send(" 삭제할 출석부가 없습니다.")
            }
        }else{
            res.status(401).json({message: '토큰과 사용자가 일치하지 않습니다.'})//잘못된 접근데쓰네'})
        }

    } catch (error) {
      console.error(error);
    } 
    })






module.exports = router;