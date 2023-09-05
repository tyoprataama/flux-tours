class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor); // READ THE DOCS: https://nodejs.org/dist/latest-v16.x/docs/api/errors.html#errorcapturestacktracetargetobject-constructoropt
  }
}
module.exports = AppError;
