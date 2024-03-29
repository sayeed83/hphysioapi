const controller = require('../controllers/users')
const validate = require('../controllers/users.validate')
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
router.get(
  '/',
  trimRequest.all,
  controller.getItems
)

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
router.get(
  '/:id',
  trimRequest.all,
  validate.getItem,
  controller.getItem
)

/*
 * Update item route
 */
router.patch(
  '/:id',
  trimRequest.all,
  validate.updateItem,
  controller.updateItem
)

/*
 * Delete item route
 */
// router.delete(
//   '/:id',
//   trimRequest.all,
//   validate.deleteItem,
//   controller.deleteItem
// )
/*
 * Change mobile route
 */
router.post(
  '/change_mobile',
  trimRequest.all,
  validate.changeMobile,
  controller.changeMobile
)
/*
 * Change password route
 */
router.post(
  '/change_email',
  trimRequest.all,
  validate.changeEmail,
  controller.changeEmail
)
/*
 * Update Profile password route
 */
router.post(
  '/update_profile',
  trimRequest.all,
  validate.updateProfile,
  controller.updateProfile
)
/*
 * Change password route
 */
router.post(
  '/change_password',
  trimRequest.all,
  validate.changePassword,
  controller.changePassword
)

router.post(
  '/delete_account',
  trimRequest.all,
  validate.deleteItem,
  controller.deleteAcc
)

router.post(
    '/rate_user',
    trimRequest.all,
    validate.userRating,
    controller.userRating
)

module.exports = router
