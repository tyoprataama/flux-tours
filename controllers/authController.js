const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRES
  });
  res.status(201).json({
    status: 'created',
    token: token,
    data: {
      newUser
    }
  });
});
