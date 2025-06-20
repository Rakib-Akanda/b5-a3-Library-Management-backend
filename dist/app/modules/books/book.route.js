"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const book_controller_1 = __importDefault(require("./book.controller"));
const bookRoute = (0, express_1.Router)();
bookRoute.post("/", book_controller_1.default.createBook);
bookRoute.get("/", book_controller_1.default.getBooks);
bookRoute.get("/:bookId", book_controller_1.default.getSingleBook);
bookRoute.patch("/:bookId", book_controller_1.default.updateBook);
bookRoute.delete("/:bookId", book_controller_1.default.deleteBook);
exports.default = bookRoute;
