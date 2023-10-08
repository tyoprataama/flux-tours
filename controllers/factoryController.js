const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = Type =>
  catchAsync(async (req, res, next) => {
    const doc = await Type.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(
        new AppError('No document found! please check the ID correctly', 404)
      );
    }
    res.status(204).json({
      status: 'deleted!',
      data: null
    });
  });

exports.createOne = Type =>
  catchAsync(async (req, res, next) => {
    const doc = await Type.create(req.body);
    res.status(201).json({
      status: 'created',
      data: {
        doc
      }
    });
  });
