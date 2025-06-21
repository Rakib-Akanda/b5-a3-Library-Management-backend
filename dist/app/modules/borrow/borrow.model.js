"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const book_model_1 = __importDefault(require("../books/book.model"));
const customError_1 = require("../../../utils/customError");
const borrowSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Books",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "At least 1 book"],
    },
    dueDate: {
        type: Date,
        required: true,
    },
}, {
    versionKey: false,
    timestamps: true,
});
borrowSchema.static("borrowBook", async function borrowBook(borrowBody) {
    const { book: bookId, quantity, dueDate } = borrowBody;
    //   console.log(bookId, quantity, dueDate);
    const book = await book_model_1.default.findOneAndUpdate({
        _id: bookId,
        copies: { $gte: quantity },
    }, [
        {
            $set: {
                copies: { $subtract: ["$copies", quantity] },
            },
        },
        {
            $set: {
                available: { $gt: ["$copies", 0] },
            },
        },
    ], {
        new: true,
        runValidators: true,
    });
    if (!book)
        throw new customError_1.CustomError(404, "Not enough copies available");
    if (book.copies === 0)
        book.available = false;
    const borrow = await Borrow.create({
        book: bookId,
        quantity,
        dueDate,
    });
    return borrow;
});
const Borrow = (0, mongoose_1.model)("Borrow", borrowSchema);
exports.default = Borrow;
