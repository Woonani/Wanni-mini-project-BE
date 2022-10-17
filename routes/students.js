const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken'); //*중요!
const bcrypt = require('bcrypt');
const { verifyToken } = require('../library/middlewares');
const { Student,User } = require('../models')
const ErrorResponse = require('../utils/errorResponse')
// const Student = require('../models/student');




//학생정보 등록 /students/:id // db에 선생님 아이디로 저장해야 하니까
//{ stuName, stuGrade, school, phoneNum, etc } = req.body

router.post('/:id', verifyToken, async (req, res, next) => {
  const { stuName, stuGrade, school, phoneNum, etc } = req.body;
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
//모든 학생 조회
router.get('/:id/info/all', verifyToken, async (req, res, next) => {
  
  try {

    if(req.decoded.id == req.params.id){
      console.log('확인해보자',req.params.id)
      req.student = await Student.findAll({
          // attributes : ['id','stuName','stuGrade','school','phoneNum','etc'],
  
          where : {teachId : req.params.id}
        })
        // console.log(req.params.id)
  
      res.status(200).json({ success: true, data: req.student })
    }else{
      res.status(401).json({message: '잘못된 접근데쓰네'})
    }
  } catch (err) {

    res.status(400).json({ success: false, message : '선생님에겐 등록된 학생이 없습니다'})
    // return next(new ErrorResponse('Not authorized to access this route', 401))
  }
} ) 

//한명의 학생만 조회
router
  .get('/:userId/info/:stuId', verifyToken, async (req, res, next) => {
    try {
      if(req.decoded.id == req.params.userId){
        req.oneStudent = await Student.findOne({
        where : {teachId : req.params.userId,
          id : req.params.stuId
        },
        // attributes:['id','stuName','stuGrade','school','phoneNum','etc']
      }       
    )
    console.log('succ,params',req.params.userId) 
    console.log('succ,params,id',req.params.stuId) 
    console.log('decoded',req.decoded.id) 
    res.status(200).json({ success: true, data: req.oneStudent })
    }else{ 
      console.log('succ,params',req.params.userId) 
    console.log('decoded',req.decoded.id)
      res.status(401).json({message: '잘못된 접근데쓰네'})}
    }catch (err) {
      console.log('err, onestudent',oneStudent) //err
      // console.log('err',req.decoded.userId) 
      console.log('err',req.params.userId) 
      res.status(400).json({ success: false, message : '에러' })

    }
  })
  


  
// //학생정보 수정 /students/:stuId     // 학생 id로 조회해야 함
router.patch('/:stuId', verifyToken, async (req, res, next) => {

  try {
    const { stuName, stuGrade, school, phoneNum, etc } = req.body;


    await Student.update({ 
      stuName, 
      stuGrade, 
      school,
      phoneNum,
      etc
     },
      { where: {id: req.params.stuId }}); 
      
    res.json({
      code: 200,
      message: `수정됐습니다 : ${req.body.stuName} ${req.body.stuGrade} ${req.body.school} ${req.body.phoneNum} ${req.body.etc}`,
    });
  } catch(error) {
    console.error(error);
    next(error);
  }
})

// //delete  /students/:stuId     // 학생 id로 조회해야 함
router.delete('/:stuId', verifyToken, async (req, res)=>{

    try {
      const deleteStudent = await Student.findOne({where: { id: req.params.stuId}}) // 포스트맨 확인하려고 req.decoded.id 를 req.body.id로 바꿈
      console.log('deleteStudent: '+ deleteStudent);
      if(deleteStudent){
        await Student.destroy({where: {id: req.params.stuId}});
        res.json({
            code: 200,
            message: ' 삭제되었습니다.',
        })
      }else{
        res.status(400).send(" 삭제할 데이터가 없습니다.")
      }
    } catch (error) {
      console.error(error);

    } 
    })

//모든 학생 조회
router.get('/:id/info/all', verifyToken, async (req, res, next) => {

  // const student = {}
  // let token
  try {
    if(req.decoded.id == req.params.id){
      console.log('확인해보자',req.params.id)
      req.student = await Student.findAll({
          attributes : ['id','stuName','stuGrade','school','phoneNum','etc'],
  
          where : {teachId : req.params.id}
        })
        // console.log(req.params.id)
  
      res.status(200).json({ success: true, data: req.student })
    }else{
      res.status(401).json({message: '잘못된 접근데쓰네'})
    }
    
 
  } catch (err) {

    res.status(400).json({ success: false, message : '선생님에겐 등록된 학생이 없습니다'})
    // return next(new ErrorResponse('Not authorized to access this route', 401))
  }
} ) 

//임시기능 : 한명의 학생만 조회 
// -> 출석부나 시간표에서 학생이름 클릭시 학생 정보 보이게 할 때 사용가능
// 1016 일 수정: 학생의 이름을 req.body에 담아 보내면 그학생의 모든 정보를 res.body에 담아보내줄게!
router
  .get('/:userId/info/:stuName', verifyToken, async (req, res, next) => {
    try {      
      if(req.decoded.id == req.params.userId){

        req.oneStudent = await Student.findOne({ //oneStudent를 req.oneStudent로 수정
        where : {teachId : req.params.userId,
          stuName : req.params.stuName //수정 필요// 1016 일 수정
        },
        // attributes:['id','stuName','stuGrade','school','phoneNum','etc']
      }       

      )
        console.log('succ,params',req.params.userId) 
        console.log('decoded',req.decoded.id) 
        res.status(200).json({ success: true, data: req.oneStudent })//oneStudent를 req.oneStudent로 수정
      }else{ 
        console.log('succ,params',req.params.userId) 
        console.log('decoded',req.decoded.id)
        res.status(401).json({message: '잘못된 접근데쓰네'})}
    }catch (err) {
      console.log('err, onestudent',oneStudent) //err
      // console.log('err',req.decoded.userId) 
      console.log('err',req.params.userId) 
      res.status(400).json({ success: false, message : '에러' })

    }
  })




module.exports = router;
