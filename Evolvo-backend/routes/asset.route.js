import { Router } from "express";
import { limiter } from "../middleware/limiter.middleware.js";
import {
  getAssetCount,
  increaseAssetCount,
} from "../controlers/asset.controller.js";

const assetRouter = Router();

assetRouter.get("/", limiter, getAssetCount);

assetRouter.post("/", increaseAssetCount);

export default assetRouter;