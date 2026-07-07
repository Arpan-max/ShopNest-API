const orderRepository = require('../repositories/orderRepository');
const ApiError = require('../utils/ApiError');

const placeOrder = async (userId, shippingAddress) => {
  try {
    const order = await orderRepository.createOrder(userId, shippingAddress);
    return await orderRepository.findById(order.id);
  } catch (error) {
    if (error.message === 'CART_EMPTY') {
      throw new ApiError(400, 'Cannot place order with an empty cart');
    }
    if (error.message.startsWith('OUT_OF_STOCK_')) {
      const productId = error.message.split('_').pop();
      throw new ApiError(409, `Product ${productId} is out of stock or requested quantity unavailable`);
    }
    throw error;
  }
};

const getUserOrders = async (userId) => {
  return await orderRepository.findByUserId(userId);
};

const getOrderById = async (orderId, user) => {
  const order = await orderRepository.findById(orderId);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Customers can only view their own orders
  if (user.role !== 'admin' && order.user_id !== user.id) {
    throw new ApiError(403, 'Not authorized to view this order');
  }

  return order;
};

const updateOrderStatus = async (orderId, status) => {
  const order = await orderRepository.findById(orderId);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  return await orderRepository.updateStatus(orderId, status);
};

module.exports = {
  placeOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus
};
