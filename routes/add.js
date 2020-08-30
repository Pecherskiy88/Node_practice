const { Router } = require('express');
const { validationResult } = require('express-validator');
const Course = require('../models/course');
const router = Router();
const auth = require('../middleware/auth');
const { courseValidators } = require('../utils/validators');

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Добавить курс',
    isAdd: true,
  });
});

router.post('/', auth, courseValidators, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: 'Добавить курс',
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
      },
    });
  }

  const { title, price, img } = req.body;
  const course = new Course({
    title,
    price,
    img,
    userId: req.user._id,
  });

  try {
    await course.save();
    res.redirect('/courses');
  } catch (e) {
    console.log('Save BD Error: ', e);
  }
});

module.exports = router;
