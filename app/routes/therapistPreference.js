const controller = require('../controllers/therapistPreference')
const validate = require('../controllers/therapistPreference.validate')
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
    validate.createItem,
    controller.createItem
);


module.exports = router
