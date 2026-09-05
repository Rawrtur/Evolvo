import express from "express";

import {
  verifyApplePurchase,
  appleWebhook,
} from "../controlers/apple.controller.js";

import authorize from "../middleware/auth.middleware.js";
import { limiter } from "../middleware/limiter.middleware.js";


const appleRouter = express.Router();


/*
 * Called by the Evolvo app after a successful
 * StoreKit purchase.
 */
appleRouter.post(
  "/verify",
  limiter,
  authorize,
  verifyApplePurchase,
);


/*
 * Called directly by Apple.
 *
 * IMPORTANT:
 * No JWT middleware here.
 */
appleRouter.post(
  "/webhook",
  appleWebhook,
);


export default appleRouter;