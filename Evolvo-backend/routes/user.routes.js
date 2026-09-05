import { Router } from "express";
import {
  createUser,
  deleteUser,
  forgotPassword,
  getLeaderBoard,
  getUser,
  getUsers,
  resetPassword,
  updateEmail,
  updateName,
  updatePassword,
} from "../controlers/user.controller.js";
import authorize from "../middleware/auth.middleware.js";
import { authLimiter, limiter } from "../middleware/limiter.middleware.js";
import authorizeAdmin from "../middleware/admin.middleware.js";

const userRouter = Router();

userRouter.get("/", limiter, authorize, authorizeAdmin, getUsers);

userRouter.get("/user/me", limiter, authorize, getUser);

userRouter.post("/", limiter, authorize, authorizeAdmin, createUser);

userRouter.put("/password/me", limiter, authorize, updatePassword);

userRouter.put("/email/me", limiter, authorize, updateEmail);

userRouter.put("/name/me", limiter, authorize, updateName);

userRouter.delete("/me", limiter, authorize, deleteUser);

userRouter.get("/leaderboard/me", limiter, authorize, getLeaderBoard);

userRouter.put("/reset-password", authLimiter, resetPassword);

userRouter.put("/forgot-password/:id", authLimiter, forgotPassword);

export default userRouter;
