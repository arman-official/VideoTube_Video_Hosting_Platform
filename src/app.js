import cors from "cors";
import express from "express";
import path from "node:path";
import rateLimit from "express-rate-limit";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200
});

app.use("/uploads", express.static(path.resolve("uploads")));
app.use(express.static("public"));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/v1/auth", authLimiter, authRouter);
app.use("/api/v1/users", apiLimiter, userRouter);
app.use("/api/v1/videos", apiLimiter, videoRouter);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || "Internal server error"
  });
});

export default app;
