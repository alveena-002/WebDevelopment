import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
  });

  res.status(500).json({
    success: false,
    message: err.message,
  });
};

export default errorHandler;