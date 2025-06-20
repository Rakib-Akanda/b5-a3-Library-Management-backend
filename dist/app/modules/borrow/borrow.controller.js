"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createBorrow = async (req, res) => {
    res.json({
        success: true,
        message: "Book created successfully",
    });
};
const borrowController = {
    createBorrow,
};
exports.default = borrowController;
