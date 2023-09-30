const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

//  CREATE SIGNTOKEN VARIABLE AND PASS PARAMETER ID
const signToken = id =>
  jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRES
  });

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'created',
    token: token,
    data: {
      newUser
    }
  });
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please insert email and password!', 400));
  }
  const user = await User.findOne({
    email
  }).select('+password'); // TO SELECT PASSWORD THAT HAS BEEN NOT SELECT IN USER SCHEMA
  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next(new AppError('Incorrect password or email'), 401);
  }
  const token = signToken(user.id);
  res.status(200).json({
    status: 'success',
    token: token
  });
});

exports.verifyRoutes = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!req.headers.authorization && !token) {
    return next(new AppError('Please login to your account', 401));
  }
  //  READ THE DOCS JWT
  const decode = await promisify(jwt.verify)(token, process.env.JWT_KEY);

  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(new AppError('Token in this user does not exist!', 401));
  }
  //  CHECK IF USER CHANGE THE PASSWORD THEN RETURN ERROR
  if (currentUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppError(
        'The password is changed, please login into your account again!',
        401
      )
    );
  }
  req.user = currentUser;
  //  GRANT USER TO THE PROTECTED ROUTES
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to this!', 403));
    }
    next();
  };
};
