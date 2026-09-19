"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProblemsByCategoryId = exports.getAllActiveCategories = void 0;
const supabase = require('../config/supabase');
// Fetch active service categories
const getAllActiveCategories = async () => {
    const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .eq('is_active', true)
        .order('category_id', { ascending: true });
    if (error) {
        const err = error;
        console.error('Supabase Error in getAllActiveCategories:', err.message);
        throw error;
    }
    return data || [];
};
exports.getAllActiveCategories = getAllActiveCategories;
// Fetch active problems for a category
const getProblemsByCategoryId = async (categoryId) => {
    const { data, error } = await supabase
        .from('service_problems')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('problem_id', { ascending: true });
    if (error) {
        const err = error;
        console.error('Supabase Error in getProblemsByCategoryId:', err.message);
        throw error;
    }
    return data || [];
};
exports.getProblemsByCategoryId = getProblemsByCategoryId;
module.exports = {
    getAllActiveCategories: exports.getAllActiveCategories,
    getProblemsByCategoryId: exports.getProblemsByCategoryId
};
//# sourceMappingURL=serviceRepository.js.map