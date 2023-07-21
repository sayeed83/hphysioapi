const controller = require('../controllers/orders')
const validate = require('../controllers/orders.validate')
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
    '/create',
    trimRequest.all,
    validate.createOrder,
    controller.createOrder
);

// payment succcess response
router.post(
    '/payment_success',
    trimRequest.all,
    validate.paymentSuccess,
    controller.paymentSuccess
);



module.exports = router
