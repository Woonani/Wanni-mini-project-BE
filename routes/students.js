const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken'); //*중요!
const bcrypt = require('bcrypt');
const { verifyToken } = require('../library/middlewares');

const ErrorResponse = require('../utils/errorResponse')

const { Student } = require('../models');
const User = require('../models/user');




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

// //   router
// //   .get('/:id', verifyToken, async (req, res, next) => {

// //     const student = {}
// //   try {
// //     // const decoded = jwt.verify(token, process.env.JWT_SECRET)
// //     req.student = await Student.findAll({ where : {'teachId' : req.params.id} })
    

// //     student.stuName = req.student.dataValues.stuName
// //     // student.stuGrade = req.student.dataValues.stuGrade
// //     // student.school = req.student.dataValues.school
// //     // student.phoneNum = req.student.dataValues.phoneNum
// //     // student.etc = req.student.dataValues.etc
// //     console.log(req.student)
// //     res.status(200).json({ success: true, data: student })
// //   } catch (err) {
// //     console.log(student, err)
// //     res.status(400).json({ success: false, data: student })
// //     // return next(new ErrorResponse('Not authorized to access this route', 401))
// //   }
// // } ) 



// // students/:id
// router.get('/:id', verifyToken, async (req, res, next) => {
//     const student = {}
//     // let token

//   try {
//     // Verify token
//     // const decoded = jwt.verify(token, process.env.JWT_SECRET)

//     req.student = await Student.findOne( {where: { teachId: req.params.id } })
//     // console.log(req.user)
//     student.id = req.user.dataValues.id
//     student.stuName = req.user.dataValues.stuName
//     // student.className = req.user.dataValues.className
//     // user.password = req.user.dataValues.password
//     // console.log(user)
//     res.status(200).json({ success: true, data: student })
//   } catch (err) {
//     console.log(err)
//     return next(new ErrorResponse('Not authorized to access this route', 401))
//   }
// } ) 
  
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






module.exports = router;
