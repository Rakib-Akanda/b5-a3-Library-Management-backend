import { Request, Response } from "express";

const createBook = async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Book created successfully",
  });
};

const bookController = {
  createBook,
};
export default bookController;
