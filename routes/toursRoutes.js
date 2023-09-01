const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router
  .route('/bestdeals')
  .get(tourController.getGoodPrice, tourController.getAllTours);
router
  .route('/bestseller')
  .get(tourController.getBestSeller, tourController.getAllTours);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.postTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
