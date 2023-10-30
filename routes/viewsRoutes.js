const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', viewsController.getOverview);
router.get('/tour/:slug', authController.verifyRoutes, viewsController.getTour);
router.get('/login', viewsController.getLoginForm);
router.get('/signup', viewsController.getSignupForm);
router.post('/signup', viewsController.postNewUser);
module.exports = router;
