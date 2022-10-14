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

  router
  .get('/:id/info/all', verifyToken, async (req, res, next) => {
   
    const student = {}
   
    let token
  try {

    req.student = await Student.findAll({
        attributes : ['id','stuName','stuGrade','school','phoneNum','etc'],
        // model : User,
        where : {'teachId' : req.params.id}
      })
    

    res.status(200).json({ success: true, data: req.student })
  } catch (err) {
    console.log(student, err)
    res.status(400).json({ success: false, data: req.student })
    // return next(new ErrorResponse('Not authorized to access this route', 401))
  }
} ) 



  






// router.post('/', async (req, res, next) => {
//   try {
//     const student = await Student.create({
//       teachId: req.body.id,
//       student: req.body.student,
//     });
//     console.log(student);
//     res.status(201).json(student);
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// });

// router.route('/:id')
//   .patch(async (req, res, next) => {
//     try {
//       const result = await Student.update({
//         student: req.body.student,
//       }, {
//         where: { id: req.params.id },
//       });
//       res.json(result);
//     } catch (err) {
//       console.error(err);
//       next(err);
//     }
//   })
//   .delete(async (req, res, next) => {
//     try {
//       const result = await Student.destroy({ where: { id: req.params.id } });
//       res.json(result);
//     } catch (err) {
//       console.error(err);
//       next(err);
//     }
//   });

module.exports = router;
