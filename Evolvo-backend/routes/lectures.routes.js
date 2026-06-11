import { Router } from "express";
import { limiter } from "../middleware/limiter.middleware.js";

const lectureRouter = Router();

lectureRouter.get("/", limiter, (req, res) =>
  res.send({ message: "GET All Lectures" }),
);

lectureRouter.get("/:id", limiter, (req, res) =>
  res.send({ message: "GET Lecture Details" }),
);

lectureRouter.post("/", limiter, (req, res) =>
  res.send({ message: "CREATE Lecture" }),
);

lectureRouter.put("/:id", limiter, (req, res) =>
  res.send({ message: "UPDATE Lecture" }),
);

lectureRouter.delete("/:id", limiter, (req, res) =>
  res.send({ message: "DELETE Lecture" }),
);

lectureRouter.get("/user/:id", limiter, (req, res) =>
  res.send({ message: "GET All User Lectures" }),
);

export default lectureRouter;
