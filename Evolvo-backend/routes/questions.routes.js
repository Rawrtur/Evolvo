import { Router } from "express";
import { limiter } from "../middleware/limiter.middleware.js";
import {
  createQuestion,
  deleteQuestion,
  getAllUserQuestions,
  updateQuestion,
} from "../controlers/questions.controller.js";
import authorize from "../middleware/auth.middleware.js";

const questionRouter = Router();

questionRouter.get("/user/:id", limiter,authorize, getAllUserQuestions);

questionRouter.delete("/:id", limiter,authorize, deleteQuestion);

questionRouter.put("/:id", limiter,authorize, updateQuestion);

questionRouter.post("/", limiter,authorize, createQuestion);

export default questionRouter;
