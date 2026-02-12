const express = require('express');
const router = express.Router();
const { getUserCart, updateUserCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getUserCart).put(protect, updateUserCart);

module.exports = router;
