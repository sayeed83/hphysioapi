const controller = require('../controllers/profession')
const validate = require('../controllers/profession.validate')
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
 * Users routes
 */

/*
 * Get items route
 */
// router.get(
//   '/',
//   trimRequest.all,
//   controller.getItems
// )

/*
 * Create new item route
 */
router.post(
  '/',
  trimRequest.all,
  validate.createItem,
  controller.createItem
)

/*
 * Get item route
 */
// router.get(
//   '/:id',
//   trimRequest.all,
//   validate.getItem,
//   controller.getItem
// )

/*
 * Update item route
 */
// router.patch(
//   '/:id',
//   trimRequest.all,
//   validate.updateItem,
//   controller.updateItem
// )

/*
 * Delete item route
 */
// router.delete(
//   '/:id',
//   trimRequest.all,
//   validate.deleteItem,
//   controller.deleteItem
// )

module.exports = router
