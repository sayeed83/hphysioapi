const { validationResult } = require('../middleware/utils')
const validator = require('validator')
const { check } = require('express-validator')

exports.addPatientServiceAddress = [
    check('user_id')
      .exists()
      .withMessage('MISSING')
      .not()
      .isEmpty()
      .withMessage('IS_EMPTY'),
    check('full_address')
      .exists()
      .withMessage('MISSING')
      .not()
      .isEmpty()
      .withMessage('IS_EMPTY'),
    check('default_address')
      .exists()
      .withMessage('MISSING')
      .not()
      .isEmpty()
      .withMessage('IS_EMPTY'),
    check('area_id')
      .exists()
      .withMessage('MISSING')
      .not()
      .isEmpty()
      .withMessage('IS_EMPTY'),
    check('city_id')
      .exists()
      .withMessage('MISSING')
      .not()
      .isEmpty()
      .withMessage('IS_EMPTY'),
    check('pincode'),
    check('flat'),
    check('landmark'),
    (req, res, next) => {
      validationResult(req, res, next)
    }
]