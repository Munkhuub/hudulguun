import { Router } from "express";
import {
  getOrder,
  getOrderById,
  createOrderController,
  putOrderById,
  deleteOrderById,
} from "../controllers/orders";
import { getAllOrder } from "../controllers/orders/get-all-order";
import { authenticationMiddleware } from "../middlewares/authentication-middleware";
import { authorizationMiddleware } from "../middlewares/authorization-middleware";
import { optionalAuthMiddleware } from "../middlewares/optional-auth-middleware";
import { rateLimit } from "../middlewares/rate-limit";

const orderRouter = Router();
const orderLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 20 });
const adminOnly = [authenticationMiddleware, authorizationMiddleware];

orderRouter
  .post("/", orderLimiter, optionalAuthMiddleware, createOrderController)
  .get("/", authenticationMiddleware, getOrder)
  .get("/all", ...adminOnly, getAllOrder)
  .get("/:id", authenticationMiddleware, getOrderById)
  .put("/:id", ...adminOnly, putOrderById)
  .delete("/:id", ...adminOnly, deleteOrderById);

export default orderRouter;
