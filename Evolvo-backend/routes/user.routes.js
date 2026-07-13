import { Router } from "express";
import {
  createUser,
  deleteUser,
  getLeaderBoard,
  getUser,
  getUsers,
  updateEmail,
  updateName,
  updatePassword,
} from "../controlers/user.controller.js";
import authorize from "../middleware/auth.middleware.js";
import { limiter } from "../middleware/limiter.middleware.js";
import authorizeAdmin from "../middleware/admin.middleware.js";

const userRouter = Router();

userRouter.get("/",limiter, getUsers);

userRouter.get("/user/:id", limiter, authorize, getUser);

userRouter.post("/", limiter, authorizeAdmin, createUser);

userRouter.put("/password/:id", limiter, authorize, updatePassword);

userRouter.put("/email/:id",limiter, authorize, updateEmail);

userRouter.put("/name/:id", limiter, authorize, updateName);

userRouter.delete("/:id", limiter, authorize, deleteUser);

userRouter.get("/leaderboard/:id", limiter, getLeaderBoard) 

export default userRouter;
