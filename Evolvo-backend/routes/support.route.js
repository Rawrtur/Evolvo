import { Router } from "express";
import { limiter } from "../middleware/limiter.middleware.js";
import {
  createSupport,
  deleteSupport,
  getAllProblems,
  updateStatus,
} from "../controlers/support.controller.js";

const supportRouter = Router();

supportRouter.get("/", limiter, getAllProblems);

supportRouter.post("/", limiter, createSupport);

supportRouter.post("/:id", limiter, updateStatus);

supportRouter.delete("/:id", limiter, deleteSupport);

export default supportRouter;
