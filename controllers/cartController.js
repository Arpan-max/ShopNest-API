const cartService = require('../services/cartService');
const asyncHandler = require('../utils/asyncHandler');

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  res.status(200).json({
    success: true,
    data: cart
  });
});

const addItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const item = await cartService.addItem(req.user.id, productId, quantity);
  res.status(200).json({
    success: true,
    data: item
  });
});

const updateItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const item = await cartService.updateItemQuantity(req.user.id, req.params.itemId, quantity);
  res.status(200).json({
    success: true,
    data: item
  });
});

const removeItem = asyncHandler(async (req, res) => {
  await cartService.removeItem(req.user.id, req.params.itemId);
  res.status(200).json({
    success: true,
    data: { message: 'Item removed from cart' }
  });
});

const clearCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.user.id);
  res.status(200).json({
    success: true,
    data: { message: 'Cart cleared' }
  });
});

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart
};
