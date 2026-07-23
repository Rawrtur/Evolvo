import { Router } from "express";
import { limiter } from "../middleware/limiter.middleware.js";
import {
  cancelSubscription,
  createSubscription,
  getAllSubscriptions,
  getUserSubscription,
  updateSubscription,
} from "../controlers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.post("/", limiter, createSubscription);

subscriptionRouter.post("/:id", limiter, updateSubscription);

subscriptionRouter.delete("/:id", limiter, cancelSubscription);

subscriptionRouter.get("/:id", limiter, getUserSubscription);

subscriptionRouter.get("/", getAllSubscriptions);

export default subscriptionRouter;
