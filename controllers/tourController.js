const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
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

exports.getTourWithIn = catchAsync(async (req, res, next) => {
  const { distance, location, unit } = req.params;
  const [lat, long] = location.split(',');
  const radius = unit === 'km' ? distance / 6378.1 : distance / 3963.2;

  if (!lat || !long) {
    next(
      new AppError(
        'Please provide your locations in latitude and longtitude!',
        400
      )
    );
  }
  console.log(distance, lat, long, unit, radius);
  const tours = await Tour.find({
    startPoint: { $geoWithin: { $centerSphere: [[long, lat], radius] } }
  });
  res.status(200).json({
    status: 'success!',
    length: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { location, unit } = req.params;
  const [lat, long] = location.split(',');
  const multiplier = unit === 'km' ? 0.001 : 0.000621317;

  if (!lat || !long) {
    next(
      new AppError(
        'Please provide your locations in latitude and longtitude!',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [long * 1, lat * 1]
        },
        distanceField: 'distances',
        distanceMultiplier: multiplier // Convert into km / miles instead of meters
      }
    },
    {
      $project: {
        distances: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success!',
    length: distances.length,
    data: {
      data: distances
    }
  });
});
exports.getTour = factoryController.getOne(Tour, { path: 'reviews' });
exports.postTour = factoryController.createOne(Tour);
exports.updateTour = factoryController.updateOne(Tour);
exports.deleteTour = factoryController.deleteOne(Tour);
exports.getAllTours = factoryController.getAll(Tour);
