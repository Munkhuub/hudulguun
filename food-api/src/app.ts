import express from "express";
import cors from "cors";
import { config } from "dotenv";
import foodRouter from "./routes/food.route";
import categoryRouter from "./routes/category.route";
import countRouter from "./routes/count.route";
import countAllRouter from "./routes/countAll.route";
import authRouter from "./routes/auth.route";
import orderRouter from "./routes/order.route";
import userRouter from "./routes/user.route";
import { connectToDatabase } from "./database/connect-to-db";

config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// All routes live under /api (public path on Vercel). They are also mounted at "/"
// so the API still works if the platform strips the /api prefix before forwarding.
const api = express.Router();
api
  .get("/health", (_req, res) => {
    res.json({ ok: true });
  })
  .use(async (_req, res, next) => {
    try {
      await connectToDatabase();
      next();
    } catch (error) {
      console.error("Database connection failed:", error);
      res.status(503).json({ message: "Database unavailable" });
    }
  })
  .use("/food", foodRouter)
  .use("/category", categoryRouter)
  .use("/count", countRouter)
  .use("/countAll", countAllRouter)
  .use("/auth", authRouter)
  .use("/orders", orderRouter)
  .use("/user", userRouter);

app
  .use(cors(allowedOrigins.length ? { origin: allowedOrigins } : undefined))
  .use(express.json({ limit: "1mb" }))
  .use("/api", api)
  .use("/", api)
  .use((_req, res) => {
    res.status(404).json({ message: "Not found" });
  })
  // Malformed JSON / thrown errors → JSON instead of Express's default HTML page.
  .use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = err?.type === "entity.parse.failed" ? 400 : err?.status || 500;
    if (status >= 500) console.error("Unhandled error:", err);
    res.status(status).json({ message: status === 400 ? "Invalid request body" : "Server Error" });
  });

export default app;
