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

exports.checkUserUpdate = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('The password cannot change in this routes'), 400);
  }
  req.filteredBody = filterdObj(req.body, 'name', 'email'); // fields declaration for user only can update name and email
  next();
});

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterdObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false
  });
  res.status(204).json({
    status: 'success',
    data: null
  });
  next();
});

exports.getUser = factoryController.getOne(User);
exports.postUsers = factoryController.createOne(User);
exports.updateUser = factoryController.updateOne(User);
exports.deleteUser = factoryController.deleteOne(User);
exports.getAllUsers = factoryController.getAll(User);
