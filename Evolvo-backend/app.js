import { PORT } from "./config/env.js";
import express from "express";

import userRouter from "./routes/user.routes.js";
import lectureRouter from "./routes/lectures.routes.js";
import authRouter from "./routes/auth.routes.js";
import connectToDataBase from "./database/mongodb.js";
import errorMiddleware from "./middleware/error.middleware.js";
// import cookieParser from "cookie-parser";
import { limiter } from "./middleware/limiter.middleware.js";
import cors from "cors";
import questionRouter from "./routes/questions.routes.js";
import subscriptionRouter from "./routes/subcription.routes.js";
import assetRouter from "./routes/asset.route.js";
import supportRouter from "./routes/support.route.js";
import appleRouter from "./routes/apple.route.js";
import aiRoute from "./routes/ai.route.js";
import helmet from "helmet";

const app = express();
// app.use(
//   cors({
//     origin: "http://localhost:8081",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   }),
// );

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8081"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);
app.use(helmet());

// app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(
  express.urlencoded({
    extended: false,
    limit: "100kb",
  }),
);
// app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use(limiter);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/lectures", lectureRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/subscriptions/apple", appleRouter);
app.use("/api/v1/monitors", assetRouter);
app.use("/api/v1/support", supportRouter);
app.use("/api/v1/ai", aiRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the Evolvo API!");
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectToDataBase();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Evolvo API is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
