const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

const AppError = require('./utils/appError');
const globalErrorHandling = require('./controllers/errorController');
const tourRoutes = require('./routes/toursRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const viewsRoutes = require('./routes/viewsRoutes');

console.log(process.env.NODE_ENV);

//  Serving static files
app.use(express.static(path.join(__dirname, 'public')));
//  Rendering the interface
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // Using path to prevent bugs

//////////   MIDDLEWARE //////////

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same User
const limiter = rateLimit({
  max: 100, // Set the max amount of request
  windowsMs: 60 * 60 * 1000, // Set to 1 hour
  message: 'Too many request, please try again later!'
});
app.use('/api', limiter);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xssClean());

app.use(cors());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'price',
      'maxGroupSize',
      'difficulty'
    ]
  })
);

// Test Middleware
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use((req, res, next) => {
  // Set header HTTP yang diperlukan
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  // Lanjutkan ke middleware berikutnya
  next();
});
// Routes
app.use('/', viewsRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/bookings', bookingRoutes);
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
