const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factoryController = require('./factoryController');

//  Create an object that includes in fields such like email, name from user body
//  This prevent user to update their role into restricted field such like role admin
const filterdObj = (body, ...fields) => {
  const newObj = {};
  Object.keys(body).forEach(el => {
    if (fields.includes(el)) newObj[el] = body[el];
  });
  return newObj;
};
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
exports.postUsers = factoryController.createOne(User);

exports.checkUserUpdate = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('The password cannot change in this routes'), 400);
  }
  req.filteredBody = filterdObj(req.body, 'name', 'email'); // fields declaration for user only can update name and email
  next();
});

exports.updateUser = factoryController.updateOne(User);

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
  next();
});
exports.deleteUser = factoryController.deleteOne(User);
