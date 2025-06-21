import { Router } from "express";
import borrowController from "./borrow.controller";

const borrowRoute = Router();
borrowRoute
  .route("/")
  .post(borrowController.createBorrow)
  .get(borrowController.getBorrow);

export default borrowRoute;
