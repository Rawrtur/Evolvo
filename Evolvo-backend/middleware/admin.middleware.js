import { ADMIN_PASSWORD } from "../config/env.js";


const authorizeAdmin = (req, res, next) => {
  try {
    const password = req.headers["x-admin-password"];

    if (!password) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.admin = true;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized",
      error: error.message,
    });
  }
};
export default authorizeAdmin;