const controller = require('../controllers/services');
const validate = require('../controllers/services.validate');
const AuthController = require('../controllers/auth');
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
router.get('/all', controller.getAllItems)

router.post(
    '/add_patient_service_address',
    trimRequest.all,
    validate.addPatientServiceAddress,
    controller.addPatientServiceAddress
)


module.exports = router
