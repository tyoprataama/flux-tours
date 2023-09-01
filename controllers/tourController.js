const Tour = require('../models/tourModel');

exports.getGoodPrice = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,sumary,price,difficulty';
  next();
};
exports.getBestSeller = (req, res, next) => {
  req.query.sort = '-ratingsQuantity';
  req.query.limit = 5;
  next();
};
////////  HANDLERS ////////
exports.getAllTours = async (req, res) => {
  try {
    // FILTERING
    const queryObj = { ...req.query };
    const path = ['sort', 'page', 'limit', 'fields'];
    path.forEach(el => delete queryObj[el]);
    // ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`); //gt=greaterThan, gte=greaterThanEqual
    let query = Tour.find(JSON.parse(queryStr));
    // SORT
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt _id');
    }
    // FIELDS
    if (req.query.fields) {
      const field = req.query.fields.split(',').join(' ');
      query = query.select(field);
    } else {
      query = query.select('-__v');
    }
    // LIMITS PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit; // FORMULA DISPLAY DATA BASED ON PAGINATION
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numPage = await Tour.countDocuments();
      if (skip >= numPage) throw new Error('This page does not exist!');
    }
    // EXECUTE QUERY
    const tours = await query;
    res.status(200).json({
      status: 'success',
      length: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.postTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'created',
      data: {
        newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
      //  check the docs about this queries in https://mongoosejs.com/docs/5.x/docs/queries.html
    });
    res.status(200).json({
      status: 'updated!',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'deleted!',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};
