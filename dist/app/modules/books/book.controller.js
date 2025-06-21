"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const book_model_1 = __importDefault(require("./book.model"));
const zod_1 = require("zod");
const ZBookSchema = zod_1.z.object({
    title: zod_1.z.string(),
    author: zod_1.z.string(),
    genre: zod_1.z.string(),
    isbn: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number(),
    available: zod_1.z.boolean(),
});
const ZUpdateBookSchema = ZBookSchema.partial().strict();
const createBook = async (req, res, next) => {
    try {
        const zodBody = await ZBookSchema.parseAsync(req.body);
        // console.log("zod body", zodBody);
        const book = await book_model_1.default.create(zodBody);
        res.status(201).json({
            success: true,
            message: "Borrow created successfully",
            data: book,
        });
    }
    catch (error) {
        next(error);
    }
};
const getBooks = async (req, res, next) => {
    try {
        const { filter, sortBy, sort, limit } = req.query;
        const sortField = sortBy || "createdAt";
        const sortOrder = sort === "asc" ? 1 : -1;
        // console.log(filter, sortBy, sort, limit);
        const books = await book_model_1.default.find({ genre: filter })
            .sort({
            [sortField]: sortOrder,
        })
            .limit(limit ? Number(limit) : 10);
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        next(error);
    }
};
const getSingleBook = async (req, res, next) => {
    try {
        const id = req.params.bookId;
        const book = await book_model_1.default.findById(id);
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not founds",
                data: book,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (error) {
        next(error);
    }
};
const updateBook = async (req, res, next) => {
    try {
        const id = req.params.bookId;
        const updatedDoc = await ZUpdateBookSchema.parseAsync(req.body);
        const book = await book_model_1.default.findByIdAndUpdate(id, updatedDoc, {
            new: true,
            runValidators: true,
        });
        res.status(201).json({
            success: true,
            message: "Book updated successfully",
            data: book,
        });
    }
    catch (error) {
        next(error);
    }
};
const deleteBook = async (req, res, next) => {
    try {
        const id = req.params.bookId;
        const book = await book_model_1.default.findByIdAndDelete(id);
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
                data: null,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
const bookController = {
    createBook,
    getBooks,
    getSingleBook,
    updateBook,
    deleteBook,
};
exports.default = bookController;
