const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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
exports.postUsers = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'created',
    data: {
      newUser
    }
  });
});
exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('The password cannot change in this routes'), 400);
  }
  const filteredBody = filterdObj(req.body, 'name', 'email'); // fields declaration for user only can update name and email
  //  Search user based on id and update it based on input req body
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    //  Returns new document which been updated and run validation before save the update
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
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    requestedAt: req.requestTime,
    message: 'This function is not defined yet'
  });
};
