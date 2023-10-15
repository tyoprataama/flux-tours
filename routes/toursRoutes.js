const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRoutes = require('./reviewRoutes');

const router = express.Router();
router.use('/:tourId/reviews', authController.verifyRoutes, reviewRoutes);
router
  .route('/bestdeals')
  .get(
    authController.verifyRoutes,
    tourController.getGoodPrice,
    tourController.getAllTours
  );
router
  .route('/bestseller')
  .get(
    authController.verifyRoutes,
    tourController.getBestSeller,
    tourController.getAllTours
  );
router
  .route('/tour-stats')
  .get(
    authController.verifyRoutes,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.getStatsTour
  );
router
  .route('/monthly-plan/:year')
  .get(
    authController.verifyRoutes,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.getMonthlyPlan
  );
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.verifyRoutes,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.postTour
  );

router
  .route('/tours-within/:distance/center/:location/:unit')
  .get(tourController.getTourWithIn);

router.route('/distance/:location/unit/:unit').get(tourController.getDistances);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.verifyRoutes,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.verifyRoutes,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
