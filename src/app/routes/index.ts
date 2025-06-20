import { Router } from "express";
import bookRoute from "../modules/books/book.route";

const routes = Router();
routes.use("/books", bookRoute);

export default routes;
