const { Router } = require('express');
const Course = require('../models/course');
const router = Router();
const auth = require('../middleware/auth');

function isOwner(course, req) {
  return course.userId.toString() === req.user._id.toString();
}

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('userId', 'email name');

    res.render('courses', {
      title: 'Курсы',
      isCourses: true,
      userId: req.user ? req.user._id.toString() : null,
      courses,
    });
  } catch (e) {
    console.error('get courses list error: ', e);
  }
});

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/');
  }

  try {
    const course = await Course.findById(req.params.id);

    if (!isOwner(course, req)) {
      return res.redirect('/courses');
    }

    res.render('course-edit', {
      title: `Редактировать ${course.title}`,
      course,
    });
  } catch (e) {
    console.error('Edit course error: ', e);
  }
});

router.post('/edit', async (req, res) => {
  try {
    const { id } = req.body;
    delete req.body.id;
    const course = await Course.findById(id);
    if (!isOwner(course, req)) {
      return res.redirect('/courses');
    }
    Object.assign(course, req.body);
    await course.save();
    res.redirect('/courses');
  } catch (e) {
    console.error('Set edit course error: ', e);
  }
});

router.post('/remove', auth, async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.body.id,
      userId: req.user._id,
    });
    res.redirect('/courses');
  } catch (e) {
    console.log('delete error: ', e);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.render('course', {
      layout: 'empty',
      title: `Курс ${course.title}`,
      course,
    });
  } catch (e) {
    console.error('Get course by id error: ', e);
  }
});

module.exports = router;
