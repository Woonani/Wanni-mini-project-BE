//회원가입과 student 입력이 같이 있음
const express = require('express');
const User = require('../models/user');
const Student = require('../models/student');

const router = express.Router();

router.route('/')
  .get(async (req, res, next) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const user = await User.create({
        name: req.body.name,
        // age: req.body.age,
        // married: req.body.married,
      });
      console.log(user);
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.get('/:id/students', async (req, res, next) => {
  try {
    const students = await Student.findAll({
      include: {
        model: User,
        where: { id: req.params.id },
      },
    });
    console.log(students);
    res.json(students);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
