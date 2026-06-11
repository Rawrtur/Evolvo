import { Router } from "express";
import { getUser, getUsers } from "../controlers/user.controller.js";
import authorize from "../middleware/auth.middleware.js";
import { limiter } from "../middleware/limiter.middleware.js";

const userRouter = Router();

userRouter.get("/",limiter, getUsers)

userRouter.get("/:id",limiter, authorize, getUser)

userRouter.post("/",limiter, (req,res)=>res.send({message:"CREATE new User"}))

userRouter.put("/:id",limiter, (req,res)=>res.send({message:"UPDATE User"}))

userRouter.delete("/:id",limiter, (req,res)=>res.send({message:"DELETE User"}))

export default userRouter;