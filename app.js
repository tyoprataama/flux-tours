const express = require('express');

const morgan = require('morgan');

const rateLimit = require('express-rate-limit');

const app = express();

const AppError = require('./utils/appError');
const globalErrorHandling = require('./controllers/errorController');
const tourRoutes = require('./routes/toursRoutes');
const userRoutes = require('./routes/userRoutes');

console.log(process.env.NODE_ENV);
//////////   MIDDLEWARE //////////
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const limiter = rateLimit({
  max: 100, // Set the max amount of request
  windowsMs: 60 * 60 * 1000, // Set to 1 hour
  message: 'Too many request, please try again later!'
});

app.use('/api', limiter);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);
//  ERROR HANDLINGS MIDDLEWARE
app.all('*', (req, res, next) => {
  const error = new AppError(
    `Cannot find ${req.originalUrl} on the server!`,
    404
  );
  next(error);
});

app.use(globalErrorHandling);
module.exports = app;
