const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factoryController = require('./factoryController');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filterObj = {};
  if (req.params.tourId) filterObj = { tour: req.params.tourId };
  const review = await Review.find(filterObj);
  res.status(200).json({
    status: 'success',
    length: review.length,
    data: {
      review
    }
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('The review is not found!', 404));
  }
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      review
    }
  });
});
exports.setTourUserId = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
});
exports.createReview = factoryController.createOne(Review);

exports.updateReview = factoryController.updateOne(Review);

exports.deleteReview = factoryController.deleteOne(Review);
