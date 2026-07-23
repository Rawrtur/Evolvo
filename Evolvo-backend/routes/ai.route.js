import express from "express";
import { feynman, generate } from "../controlers/ai.controller.js";
import upload from "../utils/multer.util.js";
import requireSubscription from "../middleware/subscription.middleware.js";

const aiRoute = express.Router();

aiRoute.post("/questions",requireSubscription, generate);

aiRoute.post("/feynman",requireSubscription, upload.single("audio"), feynman)

export default aiRoute;