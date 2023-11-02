const AppError = require('../utils/appError');

const handleCastErrDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateDB = err => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]; //  REGULAR EXPRESSION TO FIND VALUE BETWEEN QUOTES, AFTER LOG TO THE CONSOLE THE VALUE IS IN FIRST ARRAY[0]
  const message = `Duplicate field: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJwtError = err =>
  new AppError('Invalid token, please login into your account again', 401);

const handleJwtExpired = err =>
  new AppError(
    'Session has expired! please login into your account again',
    401
  );

const devError = (err, req, res) => {
  //  Render error in API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  }
  //  Render error in Development
  console.log('ERROR 😮‍💨', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
    status: err.statusCode
  });
};

const productionError = (err, req, res) => {
  //  Render error in API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    console.log('ERROR 😮‍💨', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something wrong!'
    });
  }
  //  Render error in Production
  if (err.isOperational) {
    console.log('ERRROR 😮‍💨', err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
      status: err.statusCode
    });
  }
  console.log('ERRROR 😮‍💨', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    devError(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);
    if (error.name === 'CastError') error = handleCastErrDB(error);
    if (error.code === 11000) error = handleDuplicateDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJwtError(error);
    if (error.name === 'TokenExpiredError') error = handleJwtExpired(error);
    if (error.message === 'jwt malformed') error = handleJwtExpired(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    productionError(error, req, res);
  }
};
