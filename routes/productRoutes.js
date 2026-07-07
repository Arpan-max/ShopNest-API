const express = require('express');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stockQuantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be positive'),
    body('categoryId').optional().isInt().withMessage('Category ID must be an integer')
  ],
  validateRequest,
  productController.createProduct
);

router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  [
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stockQuantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be positive'),
    body('categoryId').optional().isInt().withMessage('Category ID must be an integer')
  ],
  validateRequest,
  productController.updateProduct
);

router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

module.exports = router;
