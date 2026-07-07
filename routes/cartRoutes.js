const express = require('express');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', cartController.getCart);

router.post(
  '/',
  [
    body('productId').isInt().withMessage('Product ID must be an integer'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  validateRequest,
  cartController.addItem
);

router.put(
  '/:itemId',
  [
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  validateRequest,
  cartController.updateItem
);

router.delete('/:itemId', cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;
