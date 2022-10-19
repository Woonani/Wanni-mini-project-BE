const express = require('express');
const router = express.Router();

const { verifyToken } = require('../library/middlewares');
const { Schedule, Student, User } = require('../models')
// const ErrorResponse = require('../utils/errorResponse')
const sequelize = require("sequelize")
const Op = sequelize.Op;
// 문자전송모듈 임포트
// import {sendAttendanceSMS } from '../library/util.js'
const smsUtil = require('../library/util.js')




// CREATE : 출석부 생성
// 스케줄 정보 등록
// req.body => {
//     "lessonDate" : "2022/10/17/14:00:00",
//     "stuList" : "학생1,학생2,학생3"
// } req 요청 횟수가 많을수록 느려진다!!
// daySchedule : [{ "lessonDate" : "2022/10/1714:00", "stuList" : "a,b,c"},
//                { "lessonDate" : "2022/10/17/15:00", "stuList" : "a,b,c"}]
router.post('/:id', verifyToken, async (req, res, next) => {
    // const { lessonDate,stuName,attendTime,createdAt,studentId } = req.body;
    // const { daySchedule,lessonDate, stuList } = req.body;
    const { daySchedule } = req.body;
    try {
        let ScheduleData2 = []
        // i 번째 
        for(let i = 0 ; i<daySchedule.length ; i++){
            let lessonDate = daySchedule[i].lessonDate//"2022/10/17 14:00"
            let stuList = daySchedule[i].stuList//"a,b,c"

            
            let stuListData = stuList.split(",")
            console.log('stuListData',stuListData) //[a,b,c]
            
            let ScheduleData = []
            
            // if(stuListData[0] != ''){ // 프론트에서 처리완료

                for(k=0; k<stuListData.length; k++){

                    // console.log(stuListData[k])
                    let j = (await Student.findOne({
                        attributes : ['id'],
                        where : { 
                            teachId : req.params.id,
                            stuName : stuListData[k] }
                    }))
                    console.log("j : ", j)
                    // 아래 ScheduleData는 res확인 용
                    ScheduleData.push(
                        await Schedule.create({
                            lessonDate,
                            stuName :  stuListData[k],
                            attendTime : "출석전", 
                            teachId: req.params.id,
                            studentId : j.dataValues.id
                        })  
                    )
                    
                }
            
                ScheduleData2.push(ScheduleData)
        // }

        }
    return res.status(201).json({
        message: "success",
        data : ScheduleData2,
    })      
    
  
    } catch (error) {
      console.error('error' , error);
      return next(error);
    }
    });




    
// Read 1 - 출석부에 뿌려주기 
// GET schedule/:id/today
router.post('/:id/today', verifyToken, async (req, res, next) => {
// 
    try {
        if(req.decoded.id == req.params.id){ 
            
            const { lessonDate } = req.body; 
            console.log(lessonDate)

            todaySchedule = await Schedule.findAll({
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
// GET schedule//:id/history/:stuName
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

// Read 3 - 전체 schedule 가져오기 
// GET schedule/:id/all
router.get('/:id/all', verifyToken, async (req, res, next) => {

    try {
        if(req.decoded.id == req.params.id){ 

            const allSchedule = await Schedule.findAll({
                where : {
                    teachId : req.params.id,    
                }
            })
            if (allSchedule){
                res.status(200).json({ success: true, data: allSchedule })

            }else{ 
                res.status(401).json({message: '조회할 출석부가 없습니다.'})
            }
    
        }else{
            res.status(401).json({message: '토큰과 사용자가 일치하지 않습니다.'})//잘못된 접근데쓰네'})
        }
      
   
    } catch (err) {
  
      res.status(400).json({ success: false, message : '출석부(schedule)를 불러올 수 없습니다.'})

    }
  } ) 



// U attendence 추가하기
router.patch('/:id/today/:scheId', verifyToken, async (req, res, next) => {
    try{
        if(req.decoded.id == req.params.id){
            const { attendTime } = req.body;ㅣ
            
            // 출석 시간 DB에 입력
            const updateResult = await Schedule.update({
                attendTime
            },
            {where: { //stuId: req.params.stuId,
                id : req.params.scheId
            }}
            )
            console.log('updateResult : ', updateResult)//[1]
            
            if (updateResult > 0){
                res.json({code: 200, message: '출석시간 입력 완료 ', });
            
            }else{ 
                res.status(401).json({message: '입력할 대상이 없습니다.'})
            }
        }else{
            res.status(401).json({message: '토큰과 사용자가 일치하지 않습니다.'})//잘못된 접근데쓰네'})
        }

    }
    catch(error) {
        res.status(400).json({ success: false, message : '출석 시간을 등록 할 수 없습니다.'})

      }
})



// 등원 문자 보내기 api
router.post('/:id/sms/:scheId', async (req, res, next) => {
// router.post('/:id/sms/:scheId', verifyToken, async (req, re, next) => {
    try{
        // if(req.decoded.id == req.params.id){
            const { attendTime } = req.body;

            // 선생님 학원이름
            const smsData1 = await User.findOne({
                attributes:['className'],
                where: { id : req.params.id}
            })
            console.log('짜잔~! smsData1 : ', smsData1.dataValues.className)

            // 출석한 학생의 이름과, 학부모 전화번호, 출석시간 가져오기
            const smsData2 = await Student.findOne({
                attributes:['stuName','phoneNum'],
                include: [
                    {   model: Schedule,
                        where: { id : req.params.scheId}, 
                        attributes: ['attendTime'] }
                ],
            })
            console.log(smsData2)
            if(!smsData2){
                res.status(400).json({ success: false, message : '데이터 없음'})
            }
            console.log('짜잔~! smsData2 : ', smsData2.dataValues.stuName, smsData2.dataValues.phoneNum)
            
            const userClassName = smsData1.dataValues.className; // 학원이름 User Table
            const parentsPhoneNum = smsData2.dataValues.phoneNum; // SMS를 수신할 전화번호 Student Table
            const studentName = smsData2.dataValues.stuName; // 학생이름 Student Table
            const stuAttendance = attendTime; // 학생출석시간 Student Table
            
            
            // try {
                await smsUtil.sendAttendanceSMS(userClassName, studentName, stuAttendance, parentsPhoneNum)
                res.send("등원문자 전송완료!")

            // }catch(err){
            //     console.log(err)
            // }
            // res.json({code: 200, message: '출석시간 입력 완료 ', });
            
            
        // }else{
        //     res.status(401).json({message: '토큰과 사용자가 일치하지 않습니다.'})//잘못된 접근데쓰네'})
        // }

    }
    catch(error) {
        console.log(error)
        res.status(400).json({ success: false, message : '문자전송 실패'})

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
        if(req.decoded.id == req.params.id){

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