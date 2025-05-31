const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getCategories
} = require('../controllers/productController');
const auth = require('../middleware/auth');
const { adminAuth } = require('../middleware/roleAuth');
const { validateProduct } = require('../middleware/validation');

// Public routes
// @route   GET /api/products
// @desc    Get all products with filtering
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', getFeaturedProducts);

// @route   GET /api/products/categories
// @desc    Get product categories
// @access  Public
router.get('/categories', getCategories);

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', getProduct);

// Admin routes
// @route   POST /api/products
// @desc    Create product
// @access  Private/Admin
router.post('/', auth, adminAuth, validateProduct, createProduct);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private/Admin
router.put('/:id', auth, adminAuth, validateProduct, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private/Admin
router.delete('/:id', auth, adminAuth, deleteProduct);

module.exports = router;
