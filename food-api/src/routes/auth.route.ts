import { Router } from "express";

import { signup, signin, me } from "../controllers/auth";
import { authenticationMiddleware } from "../middlewares/authentication-middleware";
import { rateLimit } from "../middlewares/rate-limit";

export const authRouter = Router();

// Brute-force speed bump on credential endpoints.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

authRouter.post("/signup", authLimiter, signup);
authRouter.post("/signin", authLimiter, signin);
authRouter.get("/me", authenticationMiddleware, me);
export default authRouter;
