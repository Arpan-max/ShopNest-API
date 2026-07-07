const orderService = require('../services/orderService');
const asyncHandler = require('../utils/asyncHandler');

const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;
  const order = await orderService.placeOrder(req.user.id, shippingAddress);
  res.status(201).json({
    success: true,
    data: order
  });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getUserOrders(req.user.id);
  res.status(200).json({
    success: true,
    data: orders
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user);
  res.status(200).json({
    success: true,
    data: order
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await orderService.updateOrderStatus(req.params.id, status);
  res.status(200).json({
    success: true,
    data: order
  });
});

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus
};
