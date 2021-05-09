const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors");

const errorHandler = (err, _req, res, _next) => {
  // Template for Error format
  let response = {
    message: null,
    error: null,
    statusCode: null,
  };

  // Custom errors, readily formatted, sent to client and logged
  if (
    err instanceof BadRequestError ||
    err instanceof NotFoundError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError
  ) {
    response["message"] = err.message;
    response["error"] = err.error;
    response["statusCode"] = err.statusCode;
    res.status(response.statusCode).json(response);
    errorLogger(err, response);
    return;
  }

  // All other errors must be checked and formatted appropriately
  for (key in err) {
    console.log(`KEY: ${key} VALUE: ${err[key]}`);
    if (key === "message") response["message"] = err.message;
    if (key === "statusCode") response["statusCode"] = err.statusCode;
    if (key === "name") response["error"] = err.name;
    if (key === "code") {
      console.log("error['code']: ", err.code);
      if (err.code === "23505") {
        response["message"] = err.detail;
        response["statusCode"] = 401;
        response["error"] = "Unauthorized Error";
      }
    }
  }

  // Check if response fields have been set, if not use default values
  response["statusCode"] = response.statusCode || 500;
  response["message"] = response.message || "Something went wrong";
  response["error"] = response.error || "Undefined Error";

  // Send error to client and log it
  res.status(response.statusCode).json(response);
  errorLogger(err, response);
  return;
};

/**
 *
 * @param {object} err Error object
 * @param {object} response Formatted error object from error handler
 */
function errorLogger(err, response) {
  console.log("ERROR:\n");
  console.error(err);
  console.log({
    status: response.statusCode,
    message: response.message,
    error: response.error,
  });
}

module.exports = errorHandler;
