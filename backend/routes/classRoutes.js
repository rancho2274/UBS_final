// backend/routes/classRoutes.js
const express = require('express');
const { getClasses, createClass, deleteClass } = require('../controllers/classController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getClasses)
  .post(protect, createClass);

router.route('/:id')
  .delete(protect, deleteClass);

module.exports = router;