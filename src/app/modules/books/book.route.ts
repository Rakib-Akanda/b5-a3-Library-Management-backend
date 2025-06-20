import { Router } from "express";
import bookController from "./book.controller";
const bookRoute = Router();

bookRoute.post("/", bookController.createBook);
bookRoute.get("/", bookController.getBooks);
bookRoute.get("/:bookId", bookController.getSingleBook);
bookRoute.patch("/:bookId", bookController.updateBook);
bookRoute.delete("/:bookId", bookController.deleteBook);

export default bookRoute;
