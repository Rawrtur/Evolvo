import { Router } from "express";
import { limiter } from "../middleware/limiter.middleware.js";

const subscriptionRouter = Router();

subscriptionRouter.post("/", limiter, (req, res) =>
  res.send({ success: true, message: "CREATE Subscription" }),
);
subscriptionRouter.post("/:id", limiter, (req, res) =>
  res.send({ success: true, message: "UPDATE Subscription" }),
);
subscriptionRouter.delete("/:id", limiter, (req, res) =>
  res.send({ success: true, message: "DELETE Subscription" }),
);
subscriptionRouter.get("/:id", limiter, (req, res) =>
  res.send({ success: true, message: "GET USer Subscription" }),
);
subscriptionRouter.get("/", (req, res) =>
  res.send({ success: true, message: "GET All User Subscriptions" }),
);

export default subscriptionRouter;
