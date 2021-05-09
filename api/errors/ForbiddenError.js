class ForbiddenError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.statusCode = 403;
    this.error = "Forbidden Error";
  }
}

module.exports = ForbiddenError;
