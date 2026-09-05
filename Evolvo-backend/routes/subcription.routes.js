import { Router } from "express";
import { limiter } from "../middleware/limiter.middleware.js";
import {
  cancelSubscription,
  getUserSubscription,
} from "../controlers/subscription.controller.js";
import authorize from "../middleware/auth.middleware.js";
import { verifyApplePurchase } from "../controlers/apple.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/me",limiter,authorize, getUserSubscription);

subscriptionRouter.post("/apple/verify",verifyApplePurchase)

subscriptionRouter.post("/google/verify",)

subscriptionRouter.post("/apple/notifications",)

subscriptionRouter.post("/google/notifications",)

subscriptionRouter.post("/me/cancel",limiter,authorize, cancelSubscription)

export default subscriptionRouter;
