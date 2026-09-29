"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        success: true,
        message,
        ...(data !== null && data !== undefined && { data })
    });
};
exports.successResponse = successResponse;
const errorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        success: false,
        message
    });
};
exports.errorResponse = errorResponse;
exports.default = {
    successResponse: exports.successResponse,
    errorResponse: exports.errorResponse
};
//# sourceMappingURL=response.js.map