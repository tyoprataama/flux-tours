const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();
router.route('/signup').post(authController.signUp);
router.route('/signin').post(authController.signIn);
router.route('/logout').get(authController.logOut);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

//  Only verify user can access the route after this line
router.use(authController.verifyRoutes);
router.patch('/changePassword', authController.updatePassword);
router.patch('/updateMe', userController.uploadImg, userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);
router.get('/me', userController.getMe, userController.getUser);

//  Only admin can access the route after this line
router.use(authController.restrictTo('admin'));
router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.checkUserUpdate, userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
