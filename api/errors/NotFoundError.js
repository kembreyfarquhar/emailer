class NotFoundError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.statusCode = 404;
    this.error = "Not Found Error";
  }
}

module.exports = NotFoundError;
