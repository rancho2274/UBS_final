// backend/controllers/feedbackController.js
const { Feedback, Student, Volunteer } = require('../models');
const { analyzeSentiment } = require('../services/sentimentAnalysis');

// @desc    Submit feedback for a volunteer
// @route   POST /api/feedback
// @access  Private
// Updated submitFeedback function in feedbackController.js
exports.submitFeedback = async (req, res) => {
    try {
      const { volunteerId, sessionId, comment } = req.body;
      const studentId = req.user.id;
  
      console.log('Feedback submission - volunteerId:', volunteerId);
      console.log('Feedback submission - userId:', studentId);
  
      // Check if student exists
      const student = await Student.findOne({ where: { userId: studentId } });
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Try to find volunteer by either id or userId
      let volunteer = await Volunteer.findByPk(volunteerId);
      
      if (!volunteer) {
        volunteer = await Volunteer.findOne({ where: { userId: volunteerId } });
      }
  
      if (!volunteer) {
        return res.status(404).json({ message: 'Volunteer not found' });
      }
  
      console.log('Found volunteer:', volunteer.id);
  
      // Analyze sentiment of the comment
      const sentimentResult = await analyzeSentiment(comment);
  
      // Create feedback record
      const feedback = await Feedback.create({
        studentId: student.id,
        volunteerId: volunteer.id,
        sessionId,
        comment,
        rating: sentimentResult.rating,
        sentiment: sentimentResult.sentiment,
        confidence: sentimentResult.confidence
      });
  
      res.status(201).json({
        feedback,
        message: 'Feedback submitted successfully'
      });
    } catch (error) {
      console.error('Feedback submission error:', error);
      res.status(500).json({ message: error.message });
    }
  };

// @desc    Get feedback for a volunteer
// @route   GET /api/feedback/volunteer/:id
// @access  Private
exports.getVolunteerFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if volunteer exists
    const volunteer = await Volunteer.findOne({ where: { userId: id } });
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    // Get feedback
    const feedback = await Feedback.findAll({
      where: { volunteerId: volunteer.id },
      include: [
        {
          model: Student,
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Calculate average rating
    const totalRating = feedback.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = feedback.length > 0 ? totalRating / feedback.length : 0;

    res.json({
      feedback,
      averageRating,
      totalFeedback: feedback.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all feedback for my sessions (as a student)
// @route   GET /api/feedback/student
// @access  Private
exports.getStudentFeedback = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Check if student exists
    const student = await Student.findOne({ where: { userId: studentId } });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get feedback
    const feedback = await Feedback.findAll({
      where: { studentId: student.id },
      include: [
        {
          model: Volunteer,
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};