import express from "express";
import { PORT } from "./config/env.js";

import userRouter from "./routes/user.routes.js";
import lectureRouter from "./routes/lectures.routes.js";
import authRouter from "./routes/auth.routes.js";
import connectToDataBase from "./database/mongodb.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import { limiter } from "./middleware/limiter.middleware.js";
import cors from "cors";
import questionRouter from "./routes/questions.routes.js";
import subscriptionRouter from "./routes/subcription.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:8081",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/lectures", lectureRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.use(errorMiddleware);
app.use(limiter);

app.get("/", (req, res) => {
  res.send("Welcome to the Evolvo API!");
});

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Evolvo API is running on http://0.0.0.0:${PORT}`);

  await connectToDataBase();
});

export default app;
