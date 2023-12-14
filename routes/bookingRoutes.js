const express = require('express');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();
router.get(
  '/checkout-session/:tourId',
  authController.verifyRoutes,
  bookingController.bookingSessions
);
router.patch(
  '/confirm-payment/:bookingId',
  authController.verifyRoutes,
  bookingController.confirmPayment
);

module.exports = router;
