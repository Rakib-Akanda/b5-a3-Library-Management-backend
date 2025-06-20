import express, { Application, Request, Response } from "express";
import cors from "cors";
import routes from "./app/routes";
const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes

app.use("/api", routes);

app.use("/", async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Welcome to library management server",
  });
});

export default app;
