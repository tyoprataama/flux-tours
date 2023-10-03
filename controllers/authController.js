const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendMsg = require('../utils/mail');

//  CREATE SIGNTOKEN VARIABLE AND PASS PARAMETER ID
const signToken = id =>
  jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRES
  });
const resStatus = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOpt = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_COOKIE * 24 * 60 * 60 * 1000 // Set the cookie expires in format day
    ),
    httpOnly: true //  Prevent cookie to modified in browser
  };
  if (process.env.NODE_ENV === 'production') cookieOpt.secure = true; // Cookie will send with encrypted connections
  res.cookie('jwt', token, cookieOpt);
  res.status(statusCode).json({
    status: 'success',
    token: token,
    data: { user }
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
  });
  resStatus(newUser, 201, res);
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
  resStatus(user, 200, res);
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
      return next(new AppError('You do not have permission to do this!', 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email
  });
  if (!user) {
    return next(new AppError('User email not found!'), 404);
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get('host')}
    /api/v1/users/${resetToken}`;
  const message = `
  Hi ${user.name} (${user.email}). 
  You sent a request for updated your account password on Flux Tours. Please click link below to updated your password \n ${resetURL} \n This link is active for only 10 minutes. \n If you don't want to change your password, ignore this mail!`;
  try {
    await sendMsg({
      email: user.email,
      subject: 'Update password Flux Tours',
      message
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExp = undefined;
    await user.save({
      validateBeforeSave: false
    });
    console.log(err);
    return next(
      new AppError(
        'There was an error sending the email, Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256') //  encrypt token using hash based on sha 256 algorithm
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    //  Find the user based on token and with valid token not expired
    passwordResetToken: hashedToken,
    passwordResetExp: { $gt: Date.now() } // To check if the token still valid
  });
  if (!user) {
    return next(new AppError('Invalid token or expired!'), 400);
  }
  //  Change the current password with new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  //  Reset the token
  user.passwordResetToken = undefined;
  user.passwordResetExp = undefined;
  await user.save();
  resStatus(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password'); // +password is for add the password bcs in userschema the password is not selected
  if (!(await user.verifyPassword(req.body.currPassword, user.password))) {
    return next(new AppError('Wrong password!', 401));
  }
  //  Update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();
  resStatus(user, 200, res);
});
