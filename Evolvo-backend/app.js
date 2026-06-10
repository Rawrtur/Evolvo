import express from "express";
import { PORT } from "./config/env.js";

import userRouter from "./routes/user.routes.js";
import lectureRouter from "./routes/lectures.routes.js";
import authRouter from "./routes/auth.routes.js";
import connectToDataBase from "./database/mongodb.js";

const app = express();
//Arthurius0904
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/lectures", lectureRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Evolvo API!");
});

app.listen(PORT,async () => {
  console.log(`Subscriptiontracker API is running on http://localhost:${PORT}`);

  await connectToDataBase()
});

export default app;