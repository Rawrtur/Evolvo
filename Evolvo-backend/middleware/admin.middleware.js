const authorizeAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default authorizeAdmin;