const express = require('express');

const morgan = require('morgan');

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

app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);
//  ERROR HANDLINGS MIDDLEWARE
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on the server!`, 404));
});

app.use(globalErrorHandling);
module.exports = app;
