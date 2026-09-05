import { Router } from "express";
import {
  resendVerify,
  signIn,
  signOut,
  signUp,
  verify,
} from "../controlers/auth.controller.js";
import { authLimiter } from "../middleware/limiter.middleware.js";

const authRouter = Router();

authRouter.post("/sign-up",authLimiter, signUp);
authRouter.post("/verify", authLimiter, verify);
authRouter.post("/resend-verify", authLimiter, resendVerify);
authRouter.post("/sign-in", authLimiter, signIn);
authRouter.post("/sign-out", signOut);

export default authRouter;
