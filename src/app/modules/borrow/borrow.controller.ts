import { NextFunction, Request, RequestHandler, Response } from "express";
import mongoose, { Types } from "mongoose";
import { z } from "zod";
import Borrow from "./borrow.model";
import { CustomError } from "../../../utils/customError";

// zod
const ZObjectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  })
  .transform((id) => new Types.ObjectId(id));
const ZBorrowSchema = z.object({
  book: ZObjectIdSchema,
  quantity: z.number(),
  dueDate: z
    .string()
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date formate",
    }),
});
// controller
const createBorrow: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const zodBody = await ZBorrowSchema.strict().parseAsync(req.body);
    // console.log(zodBody);

    const borrowBook = await Borrow.borrowBook(zodBody);

    res.json({
      success: true,
      message: "Book borrow successfully",
      data: borrowBook,
    });
  } catch (error) {
    next(error);
  }
};
const getBorrow: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // console.log("hello from get summary");
    const summary = await Borrow.aggregate([
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
    if (!summary.length) throw new CustomError(404, "data not found");
    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};
const borrowController = {
  createBorrow,
  getBorrow,
};

export default borrowController;
