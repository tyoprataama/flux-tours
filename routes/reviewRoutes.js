const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router
  .route('/')
  .get(authController.verifyRoutes, reviewController.getAllReviews)
  .post(
    authController.verifyRoutes,
    authController.restrictTo('user'),
    reviewController.createReview
  );
module.exports = router;
