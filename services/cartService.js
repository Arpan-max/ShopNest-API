const cartRepository = require('../repositories/cartRepository');
const productRepository = require('../repositories/productRepository');
const ApiError = require('../utils/ApiError');

const getCart = async (userId) => {
  const items = await cartRepository.findByUserId(userId);
  let subtotal = 0;
  
  const formattedItems = items.map(item => {
    const itemTotal = parseFloat(item.product_price) * item.quantity;
    subtotal += itemTotal;
    return {
      id: item.id,
      product: {
        id: item.product_id,
        name: item.product_name,
        price: item.product_price,
        image: item.product_image
      },
      quantity: item.quantity,
      itemTotal
    };
  });

  return {
    items: formattedItems,
    subtotal
  };
};

const addItem = async (userId, productId, quantity = 1) => {
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const existingItem = await cartRepository.findItem(userId, productId);
  const currentQuantity = existingItem ? existingItem.quantity : 0;
  const newQuantity = currentQuantity + quantity;

  if (newQuantity > product.stock_quantity) {
    throw new ApiError(400, `Requested quantity exceeds available stock (${product.stock_quantity} available)`);
  }

  return await cartRepository.createOrUpdate(userId, productId, quantity);
};

const updateItemQuantity = async (userId, itemId, quantity) => {
  const item = await cartRepository.findItemById(itemId, userId);
  if (!item) {
    throw new ApiError(404, 'Cart item not found');
  }

  const product = await productRepository.findById(item.product_id);
  if (quantity > product.stock_quantity) {
    throw new ApiError(400, `Requested quantity exceeds available stock (${product.stock_quantity} available)`);
  }

  return await cartRepository.updateQuantity(itemId, quantity);
};

const removeItem = async (userId, itemId) => {
  const item = await cartRepository.findItemById(itemId, userId);
  if (!item) {
    throw new ApiError(404, 'Cart item not found');
  }
  return await cartRepository.remove(itemId, userId);
};

const clearCart = async (userId) => {
  return await cartRepository.clearCart(userId);
};

module.exports = {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart
};
