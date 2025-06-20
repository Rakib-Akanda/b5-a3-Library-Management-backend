"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const borrow_controller_1 = __importDefault(require("./borrow.controller"));
const borrowRoute = (0, express_1.Router)();
borrowRoute
    .route("/")
    .post(borrow_controller_1.default.createBorrow);
exports.default = borrowRoute;
