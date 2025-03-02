export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return next(error);
    });
  };
};
export const globalErrorHandler = (err, req, res, next) => {
  if (process.env.MODE == "DEV") {
    return res.status(err["cause"] || 500).json({
      message: "Server error",
      error: err.message,
      stack: err.stack,
    });
  }
  return res.status(err["cause"] || 500).json({
    message: "Server error",
    error: err.message,
  });
};
