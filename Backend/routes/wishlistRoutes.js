const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { verifyToken } = require('../middleware/authMiddleware');

// All wishlist routes require authentication
router.use(verifyToken);

// Wishlist routes
router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.delete('/:itemId', wishlistController.removeFromWishlist);
router.delete('/', wishlistController.clearWishlist);

module.exports = router;
