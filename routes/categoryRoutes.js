const express = require('express');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', categoryController.getCategories);

router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('slug').notEmpty().withMessage('Slug is required')
  ],
  validateRequest,
  categoryController.createCategory
);

router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('slug').notEmpty().withMessage('Slug is required')
  ],
  validateRequest,
  categoryController.updateCategory
);

router.delete('/:id', authMiddleware, adminMiddleware, categoryController.deleteCategory);

module.exports = router;
