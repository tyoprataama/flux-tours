const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signUp);

router.route('/signin').post(authController.signIn);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router
  .route('/changePassword')
  .patch(authController.verifyRoutes, authController.updatePassword);

router
  .route('/updateUser')
  .patch(authController.verifyRoutes, userController.updateUser);
router
  .route('/deleteMe')
  .delete(authController.verifyRoutes, userController.deleteMe);
router
  .route('/me')
  .get(
    authController.verifyRoutes,
    userController.getMe,
    userController.getUser
  );
router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(
    authController.verifyRoutes,
    userController.checkUserUpdate,
    userController.updateUser
  )
  .delete(userController.deleteUser);

module.exports = router;
