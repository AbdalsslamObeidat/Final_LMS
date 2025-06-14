export const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Logs the full error stack, for debugging in dev

  let statusCode = err.statusCode || 500; // uses inernal server error in case there is no statusCode in the error
  // Hiding internal errors in production, but show them in dev
  let message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong"
      : err.message || "Internal Server Error";
  // Customize for some error types
  if (err.name === "ValidationError") {
    statusCode = 400;
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }
  // JSON response message
  res
    .status(statusCode)
    .type("application/json")
    .json({
      success: false,
      error: message,
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
};
// route dosent match catch
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
