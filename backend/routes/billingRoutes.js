const express = require('express');
const router = express.Router();
const { getBills, generateBill, payBill } = require('../controllers/billingController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getBills)
  .post(protect, generateBill);

router.post('/pay', protect, payBill);

module.exports = router;
