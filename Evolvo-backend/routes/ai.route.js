import express from "express";
import { generate } from "../controlers/ai.controller.js";

const aiRoute = express.Router();

aiRoute.post("/questions", generate);

export default aiRoute;