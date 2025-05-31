const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
} = require('../controllers/wishlistController');

// All routes are protected (require authentication)
router.use(protect);

// @route   GET /api/wishlist
// @desc    Get user wishlist
// @access  Private
router.get('/', getWishlist);

// @route   POST /api/wishlist/add
// @desc    Add item to wishlist
// @access  Private
router.post('/add', addToWishlist);

// @route   DELETE /api/wishlist/remove/:productId
// @desc    Remove item from wishlist
// @access  Private
router.delete('/remove/:productId', removeFromWishlist);

// @route   DELETE /api/wishlist/clear
// @desc    Clear wishlist
// @access  Private
router.delete('/clear', clearWishlist);

module.exports = router;
