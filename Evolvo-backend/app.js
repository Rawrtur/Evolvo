import express from "express";
import { PORT } from "./config/env.js";

import userRouter from "./routes/user.routes.js";
import lectureRouter from "./routes/lectures.routes.js";
import authRouter from "./routes/auth.routes.js";
import connectToDataBase from "./database/mongodb.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/lectures", lectureRouter);

app.use(errorMiddleware)

app.get("/", (req, res) => {
  res.send("Welcome to the Evolvo API!");
});

app.listen(PORT,async () => {
  console.log(`Subscriptiontracker API is running on http://localhost:${PORT}`);

  await connectToDataBase()
});

export default app;