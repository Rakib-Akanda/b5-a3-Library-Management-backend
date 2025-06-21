"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    statusCode;
    payload;
    constructor(statusCode, message, payload) {
        super(message);
        this.statusCode = statusCode;
        this.payload = payload;
    }
}
exports.CustomError = CustomError;
