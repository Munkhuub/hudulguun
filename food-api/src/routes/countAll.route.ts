import { Router } from "express";
import { countAllFood } from "../controllers/counter/count-all-food";

const countAllRouter = Router();

countAllRouter.get("/", countAllFood);

export default countAllRouter;
