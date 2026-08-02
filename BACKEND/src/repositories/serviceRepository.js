const supabase = require('../config/supabase');

// Fetch active service categories
const getAllActiveCategories = async () => {
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .eq('is_active', true)
    .order('category_id', { ascending: true });

  if (error) {
    console.error('Supabase Error in getAllActiveCategories:', error.message);
    throw error;
  }
  return data || [];
};

// Fetch active problems for a category
const getProblemsByCategoryId = async (categoryId) => {
  const { data, error } = await supabase
    .from('service_problems')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('problem_id', { ascending: true });

  if (error) {
    console.error('Supabase Error in getProblemsByCategoryId:', error.message);
    throw error;
  }
  return data || [];
};

module.exports = {
  getAllActiveCategories,
  getProblemsByCategoryId
};