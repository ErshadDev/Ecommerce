/**
 * Sets the status code to 404 and creates a new error with a message indicating that the resource was not found.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @return {void}
 */
export const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
};

/* eslint-disable no-unused-vars */
export const errorHandler = (err, req, res, next) => {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  // console.log(err.message);
  // console.log(err.stack);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

/**
 * Wraps an asynchronous function to catch any errors and pass them to the express error handling middleware.
 *
 * @param {function} theFunc - The asynchronous function to be wrapped.
 * @return {function} - The wrapped function that catches any errors and passes them to the express error handling middleware.
 */
export function catchAsync(theFucn) {
  return (req, res, next) => {
    Promise.resolve(theFucn(req, res, next)).catch(next);
  };
}
