const categoryService = require('../services/categoryService');
const asyncHandler = require('../utils/asyncHandler');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  res.status(200).json({
    success: true,
    data: categories
  });
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, slug } = req.body;
  const category = await categoryService.createCategory(name, slug);
  res.status(201).json({
    success: true,
    data: category
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name, slug } = req.body;
  const category = await categoryService.updateCategory(req.params.id, name, slug);
  res.status(200).json({
    success: true,
    data: category
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  res.status(200).json({
    success: true,
    data: { message: 'Category removed' }
  });
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
