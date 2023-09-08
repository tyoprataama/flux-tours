const jwt = require('jsonwebtoken');
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
    passwordConfirm: req.body.passwordConfirm
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
    console.log('token: ', token);
  }
  if (!req.headers.authorization && !token) {
    return next(new AppError('Please login to your account', 401));
  }
  next();
});
