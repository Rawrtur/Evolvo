import express from "express";
import { feynman, generate } from "../controlers/ai.controller.js";
import upload from "../utils/multer.util.js";
import requireSubscription from "../middleware/subscription.middleware.js";
import authorize from "../middleware/auth.middleware.js";
import { aiLimiter} from "../middleware/limiter.middleware.js";

const aiRoute = express.Router();

aiRoute.post("/questions", aiLimiter, authorize, requireSubscription, generate);

aiRoute.post(
  "/feynman",
  aiLimiter,
  authorize,
  requireSubscription,
  upload.single("audio"),
  feynman,
);

export default aiRoute;
