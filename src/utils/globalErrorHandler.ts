import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { CustomError } from "./customError";
import { Error as MongooseError } from "mongoose";
import handleValidationError from "./handleValidationError";
import { node_env } from "../config";

const globalErrorHandler: ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // custom error
  const cause = error.cause ?? error;
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.payload ?? null,
    });
    return;
    // mongoose validation error
  } else if (error instanceof MongooseError.ValidationError) {
    // mongoose validation error
    const formattedError = handleValidationError(error);
    // console.log(formattedError);
    res.status(400).json(formattedError);
    return;
  } else if (cause?.code === 11000) {
    const field =
      (cause.keyPattern && Object.keys(cause.keyPattern)[0]) ||
      (cause.keyValue && Object.keys(cause.keyValue)[0]) ||
      "unknown";
    const value =
      (cause.keyValue && cause.keyValue[field]) ||
      (cause.keyValue ? JSON.stringify(cause.keyValue) : "N/A");

    // console.log(value, field);
    res.status(409).json({
      message: `${field} must be unique`,
      success: false,
      error: {
        name: "DuplicateKeyError",
        field,
        value,
      },
    });
    return;
  } else {
    res.status(error.status || 500).json({
      message: "Internal Server Error",
      success: false,
      error: node_env === "development" ? error : "Something went wrong",
    });
  }
};

export default globalErrorHandler;
