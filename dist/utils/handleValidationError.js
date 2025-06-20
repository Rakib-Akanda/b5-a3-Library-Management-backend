"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = (err) => {
    const simplifiedErrors = {};
    for (const key in err.errors) {
        const fieldError = err.errors[key];
        simplifiedErrors[key] = {
            message: fieldError.message,
            name: fieldError.name,
            properties: fieldError.properties,
            kind: fieldError.kind,
            path: fieldError.path,
            value: fieldError.value,
        };
    }
    return {
        message: "Validation failed",
        success: false,
        error: {
            name: "ValidationError",
            error: simplifiedErrors,
        },
    };
};
exports.default = handleValidationError;
