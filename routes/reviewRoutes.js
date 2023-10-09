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
  .patch(authController.verifyRoutes, reviewController.updateReview)
  .delete(
    authController.verifyRoutes,
    authController.restrictTo('admin'),
    reviewController.deleteReview
  );
module.exports = router;
