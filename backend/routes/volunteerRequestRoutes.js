const express = require('express');
const router = express.Router();
const volunteerRequestController = require('../controllers/volunteerRequestController');
const { protect } = require('../middleware/auth');

router.get('/', protect, volunteerRequestController.getVolunteerRequests);
router.get('/:id', protect, volunteerRequestController.getVolunteerRequest);
router.post('/', protect, volunteerRequestController.createVolunteerRequest);
router.put('/:id/cancel', protect, volunteerRequestController.cancelVolunteerRequest);
router.put('/:id', protect, volunteerRequestController.updateVolunteerRequest);

module.exports = router;