"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    genre: {
        type: String,
        required: true,
        enum: [
            "FICTION",
            "NON-FICTION",
            "SCIENCE",
            "HISTORY",
            "BIOGRAPHY",
            "FANTASY",
        ],
        trim: true,
    },
    isbn: {
        type: String,
        required: true,
        trim: true,
        unique: [true, "isbn already exists"],
    },
    description: {
        type: String,
        trim: true,
    },
    copies: {
        type: Number,
        required: true,
        min: [0, "Copies must be a positive number"],
    },
    available: {
        type: Boolean,
        required: true,
        default: true,
    },
}, {
    versionKey: false,
    timestamps: true,
});
const Book = (0, mongoose_1.model)("Books", bookSchema);
exports.default = Book;
