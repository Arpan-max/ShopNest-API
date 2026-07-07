const ApiError = require('../utils/ApiError');

const errorMiddleware = (err, req, res, next) => {
  let { statusCode, message, errors } = err;

  // Set default status code and message if not an ApiError
  if (!(err instanceof ApiError)) {
    statusCode = statusCode || 500;
    message = err.message || 'Internal Server Error';
  }

  const response = {
    success: false,
    message,
    ...(errors && errors.length > 0 && { errors })
  };

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = { errorMiddleware };
