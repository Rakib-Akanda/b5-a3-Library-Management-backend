"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
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
    if (error) {
        console.log(error, "Global error");
        res.status(400).json({
            message: error.message,
            error,
        });
    }
});
exports.default = app;
