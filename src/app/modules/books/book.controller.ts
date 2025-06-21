import { NextFunction, Request, RequestHandler, Response } from "express";
import Book from "./book.model";
import { z } from "zod";

const ZBookSchema = z.object({
  title: z.string(),
  author: z.string(),
  genre: z.string(),
  isbn: z.string(),
  description: z.string().optional(),
  copies: z.number(),
  available: z.boolean(),
});
const ZUpdateBookSchema = ZBookSchema.partial().strict();

const createBook: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const zodBody = await ZBookSchema.parseAsync(req.body);
    // console.log("zod body", zodBody);
    const book = await Book.create(zodBody);
    res.status(201).json({
      success: true,
      message: "Borrow created successfully",
      data: book,
    });
  } catch (error: any) {
    next(error);
  }
};

const getBooks: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { filter, sortBy, sort, limit } = req.query;
    const sortField = sortBy || "createdAt";
    const sortOrder = sort === "asc" ? 1 : -1;
    // console.log(filter, sortBy, sort, limit);
    const books = await Book.find({ genre: filter })
      .sort({
        [sortField as string]: sortOrder,
      })
      .limit(limit ? Number(limit) : 10);
    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleBook: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.bookId;
    const book = await Book.findById(id);
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
  } catch (error) {
    next(error);
  }
};
const updateBook: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.bookId;
    const updatedData = await ZUpdateBookSchema.parseAsync(req.body);
    const updatedDoc: any = {};
    if (updatedData.copies !== undefined) {
      updatedDoc.$inc = { copies: updatedData.copies };
    }
    const { copies, ...otherFields } = updatedData;
    if (Object.keys(otherFields).length > 0) {
      updatedDoc.$set = otherFields;
    }
    const book = await Book.findByIdAndUpdate(id, updatedDoc, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};
const deleteBook: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.bookId;
    const book = await Book.findByIdAndDelete(id);
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
  } catch (error) {
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
export default bookController;
