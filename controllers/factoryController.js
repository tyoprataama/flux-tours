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

exports.updateOne = Type =>
  catchAsync(async (req, res, next) => {
    const doc = await Type.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
      //  check the docs about this queries in https://mongoosejs.com/docs/5.x/docs/queries.html
    });
    if (!doc) {
      return next(
        new AppError('No document found! please check the ID correctly', 404)
      );
    }
    res.status(200).json({
      status: 'updated!',
      data: {
        doc
      }
    });
  });

exports.getOne = (Model, populateOpt) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOpt) query = query.populate(populateOpt);
    const doc = await query;
    if (!doc) {
      return next(
        new AppError('No document found! please check the ID correctly', 404)
      );
    }
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        doc
      }
    });
  });
