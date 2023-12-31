const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factoryController = require('./factoryController');

//  The file display when updating image
// {
//   fieldname: 'photo',
//   originalname: 'original.jpeg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: 'public/img/users',
//   filename: 'user-65403866586ac974a5f88db7-1699023989429.jpeg',
//   path: 'public/img/users/user-65403866586ac974a5f88db7-1699023989429.jpeg',
//   size: 5310371
// }
// const multerStorage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'public/img/users');
//   },
//   filename: function(req, file, cb) {
//     // Because mimetype: 'image/jpeg', we only want to take the extensions value
//     const extensiosnName = file.mimetype.split('/')[1];
//     //  Set the file name: user-user.id-date.extensions
//     cb(null, `user-${req.user.id}-${Date.now()}.${extensiosnName}`);
//   }
// });

const multerStorage = multer.memoryStorage();

//  Only upload image file
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Please choose an image!', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadImg = upload.single('photo');

const filterdObj = (body, ...fields) => {
  const newObj = {};
  Object.keys(body).forEach(el => {
    if (fields.includes(el)) newObj[el] = body[el];
  });
  return newObj;
};

exports.resizeImg = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize({
      width: 500,
      height: 500,
      fit: sharp.fit.cover,
      position: sharp.strategy.entropy
    })
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

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
  // console.log(req.body);
  // console.log(req.file);
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
  if (req.file) filteredBody.photo = req.file.filename; //  Look into file info above
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
