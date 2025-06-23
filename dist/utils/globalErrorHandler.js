"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = require("./customError");
const mongoose_1 = require("mongoose");
const handleValidationError_1 = __importDefault(require("./handleValidationError"));
const config_1 = require("../config");
const globalErrorHandler = (error, req, res, next) => {
    // custom error
    const cause = error.cause ?? error;
    if (error instanceof customError_1.CustomError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
            error: error.payload ?? null,
        });
        return;
        // mongoose validation error
    }
    else if (error instanceof mongoose_1.Error.ValidationError) {
        // mongoose validation error
        const formattedError = (0, handleValidationError_1.default)(error);
        // console.log(formattedError);
        res.status(400).json(formattedError);
        return;
    }
    else if (cause?.code === 11000) {
        const field = (cause.keyPattern && Object.keys(cause.keyPattern)[0]) ||
            (cause.keyValue && Object.keys(cause.keyValue)[0]) ||
            "unknown";
        const value = (cause.keyValue && cause.keyValue[field]) ||
            (cause.keyValue ? JSON.stringify(cause.keyValue) : "N/A");
        // console.log(value, field);
        res.status(409).json({
            message: `${field} must be unique`,
            success: false,
            error: {
                name: "DuplicateKeyError",
                field,
                value,
            },
        });
        return;
    }
    else {
        res.status(error.status || 500).json({
            message: "Internal Server Error",
            success: false,
            error: config_1.node_env === "development" ? error : "Something went wrong",
        });
    }
};
exports.default = globalErrorHandler;
