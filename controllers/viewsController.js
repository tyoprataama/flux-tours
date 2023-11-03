const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'Overview',
    tours
  });
});
exports.getTour = async (req, res, next) => {
  const tour = await Tour.findOne({
    slug: req.params.slug
  }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
};
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login'
  });
};
exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Signup'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Akun'
  });
};

exports.updateDataUser = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).render('account', {
    title: 'Akun',
    user: updatedUser
  });
});
exports.postNewUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const newUser = new User({
      name,
      email,
      password,
      confirmPassword
    });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};
