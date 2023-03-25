const controller = require('../controllers/home')
const validate = require('../controllers/home.validate')
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
 * Cities routes
 */

/*
 * Get all items route
 */
router.post(
    '/',
    trimRequest.all,
    validate.getHomedata,
    controller.getHomedata
);


module.exports = router
