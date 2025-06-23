import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import routes from "./app/routes";
import globalErrorHandler from "./utils/globalErrorHandler";
import { isShuttingDown } from "./server";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes

app.use("/api", routes);
// root route
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
app.use((req: Request, res: Response) => {
  if (isShuttingDown) {
    res
      .status(503)
      .json({ message: "Service Unavailable, Server is shutting down" });
    return;
  }
  res.status(404).json({ message: "Route not found" });
});
// global error
app.use(globalErrorHandler);

export default app;
