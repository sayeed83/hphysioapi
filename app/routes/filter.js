const controller = require('../controllers/filter')
const validate = require('../controllers/filter.validate')
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
 * Get Customer Home all items route
 */
router.post(
    '/',
    trimRequest.all,
    validate.getfilterdata,
    controller.getfilterdata
);


module.exports = router
