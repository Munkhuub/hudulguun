import { Router } from "express";
import {
  deleteUserById,
  getUser,
  getUserById,
  putUserById,
} from "../controllers/user";
import { authenticationMiddleware } from "../middlewares/authentication-middleware";
import { authorizationMiddleware } from "../middlewares/authorization-middleware";

// Account creation/login live in /auth. Users may only read/update themselves.
const userRouter = Router();

userRouter
  .get("/", authenticationMiddleware, authorizationMiddleware, getUser)
  .get("/:id", authenticationMiddleware, getUserById)
  .put("/:id", authenticationMiddleware, putUserById)
  .delete("/:id", authenticationMiddleware, authorizationMiddleware, deleteUserById);

export default userRouter;
