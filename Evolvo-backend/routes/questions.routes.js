import { Router } from "express";
import { limiter } from "../middleware/limiter.middleware.js";
import {
  createQuestion,
  deleteQuestion,
  getAllUserQuestions,
  updateQuestion,
} from "../controlers/questions.controller.js";

const questionRouter = Router();

questionRouter.get("/user/:id", limiter, getAllUserQuestions);

questionRouter.delete("/:id", limiter, deleteQuestion);

questionRouter.put("/:id", limiter, updateQuestion);

questionRouter.post("/", limiter, createQuestion);

export default questionRouter;
