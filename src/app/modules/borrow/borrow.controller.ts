import { NextFunction, Request, RequestHandler, Response } from "express";
import mongoose, { Types } from "mongoose";
import { z } from "zod";
import Borrow from "./borrow.model";
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

const createBorrow: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
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

const borrowController = {
  createBorrow,
};

export default borrowController;
