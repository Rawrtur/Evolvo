import { Router } from "express";
import { limiter } from "../middleware/limiter.middleware.js";
import {
  createLecture,
  deleteLecture,
  getAllUserLectures,
  getLecture,
  getLectures,
  updateLecture,
} from "../controlers/lecture.controller.js";

const lectureRouter = Router();

lectureRouter.get("/", limiter, getLectures);

lectureRouter.get("/:id", limiter, getLecture);

lectureRouter.post("/", limiter, createLecture);

lectureRouter.put("/:id", limiter, updateLecture);

lectureRouter.delete("/:id", limiter, deleteLecture);

lectureRouter.get("/user/:id", limiter, getAllUserLectures);

export default lectureRouter;
