const productRepository = require('../repositories/productRepository');
const categoryRepository = require('../repositories/categoryRepository');
const ApiError = require('../utils/ApiError');

const getAllProducts = async (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const clampedLimit = Math.min(limit, 50); // max 50
  const offset = (page - 1) * clampedLimit;

  const filters = {
    category: query.category,
    minPrice: query.minPrice,
    maxPrice: query.maxPrice,
    search: query.search,
    sortBy: query.sortBy,
    limit: clampedLimit,
    offset
  };

  const { rows, total } = await productRepository.findAndCountAll(filters);

  return {
    data: rows,
    meta: {
      total,
      page,
      limit: clampedLimit,
      totalPages: Math.ceil(total / clampedLimit)
    }
  };
};

const getProductById = async (id) => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  return product;
};

const createProduct = async (productData) => {
  if (productData.categoryId) {
    const category = await categoryRepository.findById(productData.categoryId);
    if (!category) {
      throw new ApiError(400, 'Invalid category ID');
    }
  }

  return await productRepository.create(
    productData.name,
    productData.description,
    productData.price,
    productData.stockQuantity || 0,
    productData.categoryId || null,
    productData.imageUrl || null
  );
};

const updateProduct = async (id, fields) => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (fields.categoryId) {
    const category = await categoryRepository.findById(fields.categoryId);
    if (!category) {
      throw new ApiError(400, 'Invalid category ID');
    }
  }
  
  // Transform camelCase keys to snake_case for DB
  const dbFields = {};
  for (const [key, value] of Object.entries(fields)) {
    if (key === 'stockQuantity') dbFields['stock_quantity'] = value;
    else if (key === 'categoryId') dbFields['category_id'] = value;
    else if (key === 'imageUrl') dbFields['image_url'] = value;
    else dbFields[key] = value;
  }

  return await productRepository.update(id, dbFields);
};

const deleteProduct = async (id) => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  return await productRepository.remove(id);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
