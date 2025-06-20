import { Router } from "express";
import borrowController from "./borrow.controller";

const borrowRoute = Router();
borrowRoute
    .route("/")
    .post(borrowController.createBorrow);

export default borrowRoute;
