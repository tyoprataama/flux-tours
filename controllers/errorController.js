const AppError = require('../utils/appError');

const handleCastErrDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const devError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};
const prodError = (err, res) => {
  //  SEND ERR MESSAGE TO CLIENT
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    //  SEND UNKNOWN ERR PREVENT LEAK ERR
  } else {
    console.log('ERROR 😤', err);
    res.status(500).json({
      status: 'error',
      message: 'Something wrong!'
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    devError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);
    if (error.name === 'CastError') error = handleCastErrDB(error);
    prodError(error, res);
  }
};
