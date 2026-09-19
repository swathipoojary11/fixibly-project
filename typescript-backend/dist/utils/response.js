"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const successResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        success: true,
        message,
        ...(data && { data })
    });
};
const errorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        success: false,
        message
    });
};
module.exports = {
    successResponse,
    errorResponse
};
//# sourceMappingURL=response.js.map