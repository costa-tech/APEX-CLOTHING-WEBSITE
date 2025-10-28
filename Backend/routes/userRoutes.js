const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');

// Validation rules
const userUpdateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('role').optional().isIn(['customer', 'admin', 'moderator']).withMessage('Invalid role'),
];

// User profile routes (Protected)
router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);

// Admin routes
router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.get('/:id', verifyToken, isAdmin, userController.getUserById);
router.put('/:id', verifyToken, isAdmin, userUpdateValidation, validate, userController.updateUser);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);
router.patch('/:id/status', verifyToken, isAdmin, userController.updateUserStatus);
router.patch('/:id/role', verifyToken, isAdmin, userController.updateUserRole);
router.get('/stats/summary', verifyToken, isAdmin, userController.getUserStats);

module.exports = router;
