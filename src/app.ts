import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import routes from "./app/routes";
import { Error as MongooseError } from "mongoose";
import handleValidationError from "./utils/handleValidationError";
import { node_env } from "./config";
import { CustomError } from "./utils/customError";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes

app.use("/api", routes);

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      message: "Welcome to library management server",
    });
  } catch (error) {
    console.log(error);
    next({
      message: "Something went wrong",
      success: false,
      error,
    });
  }
});

// route not found error
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Route not found" });
});
// global error
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  // custom error
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.payload ?? null,
    });
    return;
  }
  if (error instanceof MongooseError.ValidationError) {
    // mongoose validation error
    const formattedError = handleValidationError(error);
    // console.log(formattedError);
    res.status(400).json(formattedError);
    return;
  }
  // mongodbServerError
  const cause = error.cause ?? error;
  if (cause?.code === 11000) {
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
  }
  // others error
  res.status(error.status || 500).json({
    message: "Internal Server Error",
    success: false,
    error: node_env === "development" ? error : "Something went wrong",
  });
});

export default app;
