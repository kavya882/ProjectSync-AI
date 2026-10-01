const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getAllUsers } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/', protect, getAllUsers);

module.exports = router;
