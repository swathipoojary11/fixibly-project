const serviceRepository = require('../repositories/serviceRepository');

const fetchServiceCategories = async () => {
  const categories = await serviceRepository.getAllActiveCategories();
  return categories || [];
};

const fetchProblemsByCategory = async (categoryId) => {
  if (!categoryId) throw new Error('CATEGORY_ID_REQUIRED');
  const problems = await serviceRepository.getProblemsByCategoryId(categoryId);
  return problems || [];
};

module.exports = {
  fetchServiceCategories,
  fetchProblemsByCategory
};