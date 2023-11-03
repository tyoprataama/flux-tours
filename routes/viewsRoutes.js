const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.post('/signup', authController.isLoggedIn, viewsController.postNewUser);
router.get('/account', authController.verifyRoutes, viewsController.getAccount);
router.post('/update-data-user', viewsController.updateDataUser);
module.exports = router;
