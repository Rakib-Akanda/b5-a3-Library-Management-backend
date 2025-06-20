import { Router } from "express";
import bookRoute from "../modules/books/book.route";
import borrowRoute from "../modules/borrow/borrow.route";

const routes = Router();
routes.use("/books", bookRoute);
routes.use("/borrow", borrowRoute);

export default routes;
