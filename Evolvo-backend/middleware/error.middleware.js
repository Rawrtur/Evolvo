const errorMiddleware = (err, req, res, next) => {
  console.error("API Error:", {
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Mongoose: invalid ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid resource identifier",
    });
  }

  // MongoDB: duplicate key
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A resource with this value already exists",
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const fields = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      fields,
    });
  }

  // Explicit application error
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message || "Request failed",
    });
  }

  // Unknown/unexpected error
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorMiddleware;