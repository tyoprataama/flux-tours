const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });
router
  .route('/')
  .get(authController.verifyRoutes, reviewController.getAllReviews)
  .post(
    authController.verifyRoutes,
    authController.restrictTo('user'),
    reviewController.setTourUserId,
    reviewController.createReview
  );
router
  .route('/:id')
  .get(authController.verifyRoutes, reviewController.getReview)
  .patch(
    authController.verifyRoutes,
    authController.restrictTo('admin', 'user'),
    reviewController.updateReview
  )
  .delete(
    authController.verifyRoutes,
    authController.restrictTo('admin', 'user'),
    reviewController.deleteReview
  );
module.exports = router;
