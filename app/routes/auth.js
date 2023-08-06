const controller = require('../controllers/auth')
const validate = require('../controllers/auth.validate')
const AuthController = require('../controllers/auth')
const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

/*
 * Auth routes
 */

/*
 * Register route
 */
router.post(
  '/register',
  trimRequest.all,
  validate.register,
  controller.register
)

/*
 * Verify route
 */
router.post('/verify', trimRequest.all, validate.verify, controller.verify)

/*
 * Forgot password route
 */
router.post(
  '/forgot',
  trimRequest.all,
  validate.forgotPassword,
  controller.forgotPassword
)

/*
 * Reset password route
 */
router.post(
  '/reset',
  trimRequest.all,
  validate.resetPassword,
  controller.resetPassword
)

/*
 * Get new refresh token
 */
router.get(
  '/token',
  requireAuth,
  AuthController.roleAuthorization(['user', 'admin']),
  trimRequest.all,
  controller.getRefreshToken
)

/*
 * Login route
 */
router.post('/login', trimRequest.all, validate.login, controller.login)

/*
 * Register route
 */
router.post('/sendOtp', trimRequest.all, validate.sendOtp, controller.sendOtp)
router.post('/update_free', trimRequest.all, validate.freeExpired, controller.freeExpired)
/*
 * Register route
 */
router.post(
  '/verifyOtp',
  trimRequest.all,
  validate.verifyOtp,
  controller.verifyOtp
)

router.post(
  '/verifyMobile',
  trimRequest.all,
  validate.verifyMobile,
  controller.verifyMobile
)

router.post(
  '/verifyEmail',
  trimRequest.all,
  validate.verifyEmail,
  controller.verifyEmail
)

// ============================== Customer App =================================

router.post(
  '/customer/login',
  trimRequest.all,
  validate.cust_login,
  controller.cust_login
)


module.exports = router
