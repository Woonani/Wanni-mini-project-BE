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
    const exStudentA= await Student.findOne( {where: { phoneNum: req.body.phoneNum } });
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
      if(exStudentA.stuName !== req.body.stuName){
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
      }else{
      res.status(301).send('이미 등록된 학생입니다.') 
      }
    }

  } catch (error) {
    console.error(error);
    return next(error);
  }
  });

router.get('/:id/info/all', verifyToken, async (req, res, next) => {
  
  // const student = {}
  
  // let token
  try {

    req.student = await Student.findAll({
        attributes : ['id','stuName','stuGrade','school','phoneNum','etc'],

        where : {'teachId' : req.params.id}
      })
    

    res.status(200).json({ success: true, data: req.student })
  } catch (err) {

    res.status(400).json({ success: false, message : '선생님에겐 등록된 학생이 없습니다'})
    // return next(new ErrorResponse('Not authorized to access this route', 401))
  }
} ) 

//한명의 학생만 조회
router
  .get('/:userId/info', verifyToken, async (req, res, next) => {
    try {
      oneStudent = await Student.findOne({
        where : {teachId : req.params.userId,
            id : 6
        },
        // attributes:['id','stuName','stuGrade','school','phoneNum','etc']
      }       
    )
    console.log(req.params.userId)
 
    res.status(200).json({ success: true, data: oneStudent })
 
    }catch (err) {
      console.log(oneStudent) //err
      res.status(400).json({ success: false, message : '에러' })

    }
  })
  


  
// //학생정보 수정 /students/:stuId     // 학생 id로 조회해야 함
router.patch('/:stuId', verifyToken, async (req, res, next) => {
  // if(teachId === teachId){
  //   next()
  // }else{
  //   res.status(400).json(message : )
  // }
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






module.exports = router;
