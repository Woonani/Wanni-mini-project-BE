const express = require('express');
const router = express.Router();

const { verifyToken } = require('../library/middlewares');
const {  Comment } = require('../models') //Schedule, Student,
const sequelize = require("sequelize")
const Op = sequelize.Op;

//알림장 생성
router.post('/:id', verifyToken, async (req, res, next) => {
    const {message,date } = req.body;
    try {
        if(req.decoded.id == req.params.id){
            console.log('확인해보자',req.params.id)
      const excommnet= await Comment.findOne( {where: { date: req.body.date } });
      if(!excommnet){
        await Comment.create({
            message,
            date,
            teachId: req.params.id
        });
        res.status(201).json({ code: 201, message: "success", date : excommnet })      
      } else {
        res.status(401).json({message: `이미 ${date} 날짜의 데이터가 있습니다.`})
    }
}else{
    res.status(401).json({message: '잘못된 접근데쓰네'})
  }
} catch (error) {
      console.error('err',error);
      return next('err',error);
    }
    });


//2. 읽어오기
router.post('/:id/today', verifyToken, async (req, res, next) => {
    // 
        try {
            if(req.decoded.id == req.params.id){ 
                
                const { date } = req.body; 
                // console.log(date)
    
                todayComment = await Comment.findAll({
                    where : {
                        teachId : req.params.id, 
                        // 날짜 검색 일부만 도 가능
                        date : {[Op.like]: "%" + date + "%"},
                    }
                    })
                if (todayComment){
                    res.status(200).json({ success: true, data: todayComment })
    
                }else{ 
    
                    res.status(401).json({message: '조회할 Comment가 없습니다.'})
                }
        
            }else{
                res.status(401).json({message: '토큰과 사용자가 일치하지 않습니다.'})//잘못된 접근데쓰네'})
            }
          
       
        } catch (err) {
      
          res.status(400).json({ success: false, message : '메모(Comment)를 불러올 수 없습니다.'})
    
        }
      } ) 

//2. 수정하기
router.patch('/:id', verifyToken, async (req, res, next) => {

    try {
        if(req.decoded.id == req.params.id){ 
      const { message,date } = req.body;  
  
      await Comment.update({ 
        message,
        date
       },
        { where: {teachId: req.params.id, date : date  }}); 
        
      res.json({
        code: 200,
        message: ` ${req.body.date}수정됐습니다 `,
      });
    }else{
        res.status(401).json({message: '토큰과 사용자가 일치하지 않습니다.'})//잘못된 접근데쓰네'})
    }
    } catch(error) {
        res.status(400).json({ success: false, message : '메모(Comment)를 수정 할 수 없습니다.'})
        next(error);
    }
  })
  
  //삭제하기

router.delete('/:id/date', verifyToken, async (req, res)=>{
    
    try {   
        if(req.decoded.id == req.params.id){

            const { date } = req.body       
            const deletedResult = await Comment.destroy(
                {where: {
                    teachId: req.params.id, 
                    // 날짜 검색 일부만 도 가능
                    date : {[Op.like]: "%" + date + "%"} 
                }
                });
            console.log(deletedResult) // 삭제된 로우의 갯수가 나옴

            if(deletedResult>0){
                res.json({code: 200, message: '메모 삭제 완료'})
            }else {
                res.status(400).send(" 삭제할 메모가 없습니다.")
            }
        }else{
            res.status(401).json({message: '토큰과 사용자가 일치하지 않습니다.'})//잘못된 접근데쓰네'})
        }

    } catch (error) {
      console.error(error);
    } 
    })







module.exports = router;