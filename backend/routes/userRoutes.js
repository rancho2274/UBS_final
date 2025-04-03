const express = require('express');
const { 
  getUserProfile, 
  updateUserProfile, 
  getUsersByType,
  deleteUser 
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// User profile routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin routes for managing users
// Note: You might want to add an isAdmin middleware for these routes

// backend/routes/userRoutes.js
router.get('/:type', protect, getUsersByType); // Ensure this handles user type routing correctly

// Add this as a temporary debug route in your userRoutes.js
router.get('/check-school', protect, async (req, res) => {
  try {
    const school = await School.findOne({ where: { userId: req.user.id } });
    if (school) {
      res.json({ found: true, school });
    } else {
      res.json({ found: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete('/:id', protect, deleteUser);

module.exports = router;