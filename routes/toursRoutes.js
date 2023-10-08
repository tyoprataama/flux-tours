const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router
  .route('/bestdeals')
  .get(tourController.getGoodPrice, tourController.getAllTours);
router
  .route('/bestseller')
  .get(tourController.getBestSeller, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getStatsTour);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.verifyRoutes, tourController.getAllTours)
  .post(tourController.postTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.verifyRoutes,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

router
  .route('/:tourId/reviews')
  .post(
    authController.verifyRoutes,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
