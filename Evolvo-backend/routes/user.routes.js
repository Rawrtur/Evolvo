import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req,res)=>res.send({message:"GET All Users"}))

userRouter.get("/:id", (req,res)=>res.send({message:"GET User Details"}))

userRouter.post("/", (req,res)=>res.send({message:"CREATE new User"}))

userRouter.put("/:id", (req,res)=>res.send({message:"UPDATE User"}))

userRouter.delete("/:id", (req,res)=>res.send({message:"DELETE User"}))

export default userRouter;