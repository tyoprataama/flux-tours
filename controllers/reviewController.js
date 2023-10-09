const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factoryController = require('./factoryController');

exports.setTourUserId = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
});
exports.getReview = factoryController.getOne(Review);
exports.createReview = factoryController.createOne(Review);
exports.updateReview = factoryController.updateOne(Review);
exports.deleteReview = factoryController.deleteOne(Review);
exports.getAllReviews = factoryController.getAll(Review);
