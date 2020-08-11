const { Router } = require('express');
const Course = require('../models/course');
const router = Router();
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Добавить курс',
    isAdd: true,
  });
});

router.post('/', auth, async (req, res) => {
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
