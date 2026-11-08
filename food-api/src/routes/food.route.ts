import { Router } from "express";
import {
  getFood,
  getFoodById,
  putFoodById,
  deleteFoodById,
  createFoodController,
} from "../controllers/food";
import { createOneFoodController } from "../controllers/food/createOnefoodController";
import { authenticationMiddleware } from "../middlewares/authentication-middleware";
import { authorizationMiddleware } from "../middlewares/authorization-middleware";

const foodRouter = Router();
const adminOnly = [authenticationMiddleware, authorizationMiddleware];

foodRouter
  .get("/", getFood)
  .post("/", ...adminOnly, createFoodController)
  .post("/oneFood", ...adminOnly, createOneFoodController)
  .get("/:id", getFoodById)
  .put("/:id", ...adminOnly, putFoodById)
  .delete("/:id", ...adminOnly, deleteFoodById);

export default foodRouter;
