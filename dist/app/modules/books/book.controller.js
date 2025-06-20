"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createBook = async (req, res) => {
    res.json({
        success: true,
        message: "Book created successfully",
    });
};
const bookController = {
    createBook,
};
exports.default = bookController;
