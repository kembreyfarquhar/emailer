class BadRequestError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.statusCode = 400;
    this.error = "Bad Request Error";
  }
}

module.exports = BadRequestError;
