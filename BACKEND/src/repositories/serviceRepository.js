const supabase = require('../config/supabase');

// Fetch service categories for dashboard
const getAllActiveCategories = async () => {
  const { data, error } = await supabase
    .from('service_categories')
    .select('category_id, category_name, category_image_url, is_active, created_at')
    .eq('is_active', true)
    .order('category_name', { ascending: true });

  if (error) {
    console.error('Supabase Error in getAllActiveCategories:', error.message);
    throw error;
  }
  return data;
};

// Fetch sub-problems (for booking page later)
const getProblemsByCategoryId = async (categoryId) => {
  const { data, error } = await supabase
    .from('service_problems')
    .select('problem_id, category_id, problem_name, fixed_price, is_active')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('problem_name', { ascending: true });

  if (error) {
    console.error('Supabase Error in getProblemsByCategoryId:', error.message);
    throw error;
  }
  return data;
};
module.exports = {
  getAllActiveCategories,
  getProblemsByCategoryId
};