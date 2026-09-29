const serviceRepository = require('../repositories/serviceRepository');
type IdType = string | number;
export const fetchServiceCategories = async () => {
  const categories = await serviceRepository.getAllActiveCategories();
  return categories || [];
};

export const fetchProblemsByCategory = async (categoryId: IdType) => {
  // Guard clause: ensure categoryId exists
  if (!categoryId) {
    throw new Error('CATEGORY_ID_REQUIRED');
  }

  const problems = await serviceRepository.getProblemsByCategoryId(categoryId);
  return problems || [];
};
module.exports = {
  fetchServiceCategories,
  fetchProblemsByCategory
};
