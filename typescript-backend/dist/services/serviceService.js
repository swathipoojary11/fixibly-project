"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchProblemsByCategory = exports.fetchServiceCategories = void 0;
const serviceRepository = require('../repositories/serviceRepository');
const fetchServiceCategories = async () => {
    const categories = await serviceRepository.getAllActiveCategories();
    return categories || [];
};
exports.fetchServiceCategories = fetchServiceCategories;
const fetchProblemsByCategory = async (categoryId) => {
    // Guard clause: ensure categoryId exists
    if (!categoryId) {
        throw new Error('CATEGORY_ID_REQUIRED');
    }
    const problems = await serviceRepository.getProblemsByCategoryId(categoryId);
    return problems || [];
};
exports.fetchProblemsByCategory = fetchProblemsByCategory;
module.exports = {
    fetchServiceCategories: exports.fetchServiceCategories,
    fetchProblemsByCategory: exports.fetchProblemsByCategory
};
//# sourceMappingURL=serviceService.js.map