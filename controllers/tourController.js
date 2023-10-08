const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factoryController = require('./factoryController');

exports.getGoodPrice = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,summary,price,difficulty';
  next();
};
exports.getBestSeller = (req, res, next) => {
  req.query.sort = '-ratingsQuantity';
  req.query.limit = 5;
  req.query.fields = 'name,summary,price,difficulty,ratingsQuantity';
  next();
};

////////  HANDLERS ////////
exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;
  res.status(200).json({
    status: 'success',
    length: tours.length,
    data: {
      tours
    }
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');
  if (!tour) {
    return next(
      new AppError('No tour found! please check the ID correctly', 404)
    );
  }
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour
    }
  });
});

exports.postTour = factoryController.createOne(Tour);

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
    //  check the docs about this queries in https://mongoosejs.com/docs/5.x/docs/queries.html
  });
  if (!tour) {
    return next(
      new AppError('No tour found! please check the ID correctly', 404)
    );
  }
  res.status(200).json({
    status: 'updated!',
    data: {
      tour
    }
  });
});

exports.deleteTour = factoryController.deleteOne(Tour);

exports.getStatsTour = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: {
          $gte: 4.5
        }
      }
    },
    {
      $group: {
        _id: {
          $toUpper: '$difficulty'
        },
        numTours: {
          $sum: 1
        },
        numRatings: {
          $sum: '$ratingsQuantity'
        },
        avgRating: {
          $avg: '$ratingsAverage'
        },
        avgPrice: {
          $avg: '$price'
        },
        minPrice: {
          $min: '$price'
        },
        maxPrice: {
          $max: '$price'
        }
      }
    },
    {
      $sort: {
        avgPrice: 1
      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  //READ THE MONGODB DOCS ABOUT AGGREGATION!!
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: {
          $month: '$startDates'
        },
        numTourMonth: {
          $sum: 1
        },
        tourName: {
          $push: '$name'
        }
      }
    },
    {
      $addFields: {
        month: '$_id'
      }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: {
        numTourMonth: -1
      }
    },
    {
      $limit: 5
    }
  ]);
  res.status(200).json({
    status: 'success!',
    length: plan.length,
    data: {
      plan
    }
  });
});
