import { Router } from "express";
import { limiter } from "../middleware/limiter.middleware.js";
import {
  commitLecture,
  createLecture,
  deleteLecture,
  getAllUserLectures,
  getLecture,
  getLectures,
} from "../controlers/lecture.controller.js";
import authorize from "../middleware/auth.middleware.js";

const lectureRouter = Router();

lectureRouter.get("/", limiter,authorize, getLectures);

lectureRouter.get("/user/:id",limiter,authorize, getAllUserLectures);

lectureRouter.get("/:id", limiter,authorize, getLecture);

lectureRouter.post("/", limiter,authorize, createLecture);

lectureRouter.put("/:id", limiter,authorize, commitLecture);

lectureRouter.delete("/:id", limiter,authorize, deleteLecture);


export default lectureRouter;
