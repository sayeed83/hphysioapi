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

// router.post(
//     '/delete_patient_service_address',
//     trimRequest.all,
//     validate.addPatientServiceAddress,
//     controller.addPatientServiceAddress
// )

router.post(
    '/add_physio_service_address',
    trimRequest.all,
    validate.addPhysioServiceAddress,
    controller.addPhysioServiceAddress
)

router.get('/get_service_address/:user_id', controller.getServiceAddress)


module.exports = router
