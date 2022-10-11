const express = require('express');
const { Student } = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const student = await Student.create({
      teachId: req.body.id,
      student: req.body.student,
    });
    console.log(student);
    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.route('/:id')
  .patch(async (req, res, next) => {
    try {
      const result = await Student.update({
        student: req.body.student,
      }, {
        where: { id: req.params.id },
      });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const result = await Student.destroy({ where: { id: req.params.id } });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;
