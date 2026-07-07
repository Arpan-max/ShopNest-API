const categoryRepository = require('../repositories/categoryRepository');
const ApiError = require('../utils/ApiError');

const getAllCategories = async () => {
  return await categoryRepository.findAll();
};

const createCategory = async (name, slug) => {
  try {
    return await categoryRepository.create(name, slug);
  } catch (error) {
    if (error.code === '23505') { // Unique violation in PG
      throw new ApiError(400, 'Category name or slug already exists');
    }
    throw error;
  }
};

const updateCategory = async (id, name, slug) => {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  try {
    return await categoryRepository.update(id, name, slug);
  } catch (error) {
    if (error.code === '23505') {
      throw new ApiError(400, 'Category name or slug already exists');
    }
    throw error;
  }
};

const deleteCategory = async (id) => {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  return await categoryRepository.remove(id);
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
