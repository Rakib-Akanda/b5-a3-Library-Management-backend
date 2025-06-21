"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const mongoose_1 = require("mongoose");
const handleValidationError_1 = __importDefault(require("./utils/handleValidationError"));
const config_1 = require("./config");
const customError_1 = require("./utils/customError");
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api", routes_1.default);
app.get("/", async (req, res, next) => {
    try {
        res.json({
            success: true,
            message: "Welcome to library management server",
        });
    }
    catch (error) {
        console.log(error);
        next({
            message: "Something went wrong",
            success: false,
            error,
        });
    }
});
// route not found error
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});
// global error
app.use((error, req, res, next) => {
    // custom error
    if (error instanceof customError_1.CustomError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
            error: error.payload ?? null,
        });
        return;
    }
    if (error instanceof mongoose_1.Error.ValidationError) {
        // mongoose validation error
        const formattedError = (0, handleValidationError_1.default)(error);
        // console.log(formattedError);
        res.status(400).json(formattedError);
        return;
    }
    // mongodbServerError
    const cause = error.cause ?? error;
    if (cause?.code === 11000) {
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
    // others error
    res.status(error.status || 500).json({
        message: "Internal Server Error",
        success: false,
        error: config_1.node_env === "development" ? error : "Something went wrong",
    });
});
exports.default = app;
