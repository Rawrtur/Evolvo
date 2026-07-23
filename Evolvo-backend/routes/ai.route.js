import express from "express";
import { feynman, generate } from "../controlers/ai.controller.js";
import upload from "../utils/multer.util.js";

const aiRoute = express.Router();

aiRoute.post("/questions", generate);

aiRoute.post("/feynman", upload.single("audio"), feynman)

export default aiRoute;