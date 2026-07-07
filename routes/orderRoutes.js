const express = require('express');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/',
  [
    body('shippingAddress').notEmpty().withMessage('Shipping address is required')
  ],
  validateRequest,
  orderController.placeOrder
);

router.get('/', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

router.patch(
  '/:id/status',
  adminMiddleware,
  [
    body('status')
      .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Invalid status')
  ],
  validateRequest,
  orderController.updateOrderStatus
);

module.exports = router;
