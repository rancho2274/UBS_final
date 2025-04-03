// backend/routes/feedbackRoutes.js
const express = require('express');
const { 
  submitFeedback, 
  getVolunteerFeedback, 
  getStudentFeedback
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, submitFeedback);
router.get('/volunteer/:id', protect, getVolunteerFeedback);
router.get('/student', protect, getStudentFeedback);

module.exports = router;