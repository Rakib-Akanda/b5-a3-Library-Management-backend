import { Router } from "express";
import bookRoute from "../modules/books/book.route";

const routes = Router();
routes.use("/books", bookRoute);
routes.use("/borrow");

export default routes;
