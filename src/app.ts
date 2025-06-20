import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import routes from "./app/routes";
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
  if (error) {
    console.log(error, "Global error");
    res.status(400).json({
      message: error.message,
      error,
    });
  }
});

export default app;
