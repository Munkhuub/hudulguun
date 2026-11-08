import { Router } from "express";
import {
  getFoodCategory,
  putFoodCategoryById,
  deleteFoodCategoryById,
  createCategoryController,
} from "../controllers/category";
import { authenticationMiddleware } from "../middlewares/authentication-middleware";
import { authorizationMiddleware } from "../middlewares/authorization-middleware";

const categoryRouter = Router();
const adminOnly = [authenticationMiddleware, authorizationMiddleware];

categoryRouter
  .get("/", getFoodCategory)
  .post("/", ...adminOnly, createCategoryController)
  .patch("/:id", ...adminOnly, putFoodCategoryById)
  .delete("/:id", ...adminOnly, deleteFoodCategoryById);

export default categoryRouter;
