const express = require('express');
const router = express.Router();
const { getAllUsersStats, getPlatformStats, adminGenerateBill } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

// All admin routes - require both protect + admin middleware
router.get('/users', protect, admin, getAllUsersStats);
router.get('/stats', protect, admin, getPlatformStats);
router.post('/generate-bill', protect, admin, adminGenerateBill);

module.exports = router;
