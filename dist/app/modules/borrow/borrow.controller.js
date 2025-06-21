"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const zod_1 = require("zod");
const borrow_model_1 = __importDefault(require("./borrow.model"));
const customError_1 = require("../../../utils/customError");
// zod
const ZObjectIdSchema = zod_1.z
    .string()
    .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
})
    .transform((id) => new mongoose_1.Types.ObjectId(id));
const ZBorrowSchema = zod_1.z.object({
    book: ZObjectIdSchema,
    quantity: zod_1.z.number(),
    dueDate: zod_1.z
        .string()
        .transform((val) => new Date(val))
        .refine((date) => !isNaN(date.getTime()), {
        message: "Invalid date formate",
    }),
});
// controller
const createBorrow = async (req, res, next) => {
    try {
        const zodBody = await ZBorrowSchema.strict().parseAsync(req.body);
        // console.log(zodBody);
        const borrowBook = await borrow_model_1.default.borrowBook(zodBody);
        res.json({
            success: true,
            message: "Book borrow successfully",
            data: borrowBook,
        });
    }
    catch (error) {
        next(error);
    }
};
const getBorrow = async (req, res, next) => {
    try {
        // console.log("hello from get summary");
        const summary = await borrow_model_1.default.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book",
                },
            },
            {
                $unwind: "$book",
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$book.title",
                        isbn: "$book.isbn",
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        if (!summary.length)
            throw new customError_1.CustomError(404, "data not found");
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summary,
        });
    }
    catch (error) {
        next(error);
    }
};
const borrowController = {
    createBorrow,
    getBorrow,
};
exports.default = borrowController;
