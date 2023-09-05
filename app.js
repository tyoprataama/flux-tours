const express = require('express');

const morgan = require('morgan');

const app = express();

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
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Cannot found ${req.originalUrl} on this server!`
  });
});
module.exports = app;
