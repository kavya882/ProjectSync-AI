const express = require('express');
const router = express.Router();
const { getAdminReports } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/reports', protect, authorize('ADMIN', 'FACULTY'), getAdminReports);

module.exports = router;
