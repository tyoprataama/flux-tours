const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const getUser = await User.find();
  res.status(200).json({
    status: 'success',
    length: getUser.length,
    data: {
      getUser
    }
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    requestedAt: req.requestTime,
    message: 'This function is not defined yet'
  });
};
exports.postUsers = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'created',
    data: {
      newUser
    }
  });
});
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    requestedAt: req.requestTime,
    message: 'This function is not defined yet'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    requestedAt: req.requestTime,
    message: 'This function is not defined yet'
  });
};
