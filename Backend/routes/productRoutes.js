const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Validation rules
const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/search/:query', productController.searchProducts);

// Protected routes (Admin only)
router.post('/upload-image', verifyToken, isAdmin, productController.uploadProductImage); // Add this before other POST routes
router.post('/', verifyToken, isAdmin, productValidation, validate, productController.createProduct);
router.put('/:id', verifyToken, isAdmin, productValidation, validate, productController.updateProduct);
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);
router.patch('/:id/stock', verifyToken, isAdmin, productController.updateStock);
router.post('/:id/images', verifyToken, isAdmin, upload.array('images', 5), productController.uploadImages);
router.delete('/:id/images/:imageId', verifyToken, isAdmin, productController.deleteImage);

module.exports = router;
