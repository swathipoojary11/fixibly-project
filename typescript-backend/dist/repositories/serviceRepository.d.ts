type IdType = string | number;
type ServiceCategory = {
    category_id: number;
    category_name: string;
    category_image_url?: string | null;
    is_active?: boolean;
};
type ServiceProblem = {
    problem_id: number;
    category_id: number;
    problem_name: string;
    fixed_price: number;
    is_active?: boolean;
};
export declare const getAllActiveCategories: () => Promise<ServiceCategory[]>;
export declare const getProblemsByCategoryId: (categoryId: IdType) => Promise<ServiceProblem[]>;
export {};
//# sourceMappingURL=serviceRepository.d.ts.map