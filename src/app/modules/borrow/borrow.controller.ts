import { Request, Response } from "express";

const createBorrow = async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Book created successfully",
  });
};

const borrowController = {
  createBorrow,
};

export default borrowController;
