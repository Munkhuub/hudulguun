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

const orderRouter = Router();
const adminOnly = [authenticationMiddleware, authorizationMiddleware];

orderRouter
  .post("/", authenticationMiddleware, createOrderController)
  .get("/", authenticationMiddleware, getOrder)
  .get("/all", ...adminOnly, getAllOrder)
  .get("/:id", authenticationMiddleware, getOrderById)
  .put("/:id", ...adminOnly, putOrderById)
  .delete("/:id", ...adminOnly, deleteOrderById);

export default orderRouter;
