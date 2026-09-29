const supabase = require('../config/supabase');
type IdType = string | number;

// 'service_categories'
type ServiceCategory = {
  category_id: number;
  category_name: string;
  category_image_url?: string | null;
  is_active?: boolean;
};

//'service_problems'
type ServiceProblem = {
  problem_id: number;
  category_id: number;
  problem_name: string;
  fixed_price: number;
  is_active?: boolean;
};

// Supabase errors
type DbError = {
  message?: string;
};

// Fetch active service categories
export const getAllActiveCategories = async (): Promise<ServiceCategory[]> => {
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .eq('is_active', true)
    .order('category_id', { ascending: true });

  if (error) {
    const err = error as DbError;
    console.error('Supabase Error in getAllActiveCategories:', err.message);
    throw error;
  }

  return data || [];
};
// Fetch active problems for a category
export const getProblemsByCategoryId = async (categoryId: IdType): Promise<ServiceProblem[]> => {
  const { data, error } = await supabase
    .from('service_problems')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('problem_id', { ascending: true });

  if (error) {
    const err = error as DbError;
    console.error('Supabase Error in getProblemsByCategoryId:', err.message);
    throw error;
  }

  return data || [];
};

module.exports = {
  getAllActiveCategories,
  getProblemsByCategoryId
};
