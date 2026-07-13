import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

// Auth -> Bearer Token -> user token 
const authorize = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    console.log(1111111111)
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded)
    const user = await User.findById(decoded.userId);
    console.log(user)

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;

    next();
  } catch (error) {
    console.log(error)
    res.status(401).json({
      message: "Unauthorized",
      error: error.message,
    });
  }
};

export default authorize;