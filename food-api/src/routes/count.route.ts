import { Router } from "express";
import { countFood } from "../controllers/counter/count-food";

const countRouter = Router();

countRouter.get("/", countFood);

export default countRouter;
