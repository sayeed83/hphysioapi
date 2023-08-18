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
    check('id').optional(),
    (req, res, next) => {
      validationResult(req, res, next)
    }
]

exports.addPhysioServiceAddress = [
    check('user_id')
      .exists()
      .withMessage('MISSING')
      .not()
      .isEmpty()
      .withMessage('IS_EMPTY'),
    check('address.*.full_address'),
    check('address.*.default_address').isBoolean().withMessage('Default address should be a boolean value'),
    check('address.*.area_id').isInt({ min: 1 }).withMessage('Invalid area_id'),
    check('address.*.user_id').isInt({ min: 1 }).withMessage('Invalid user_id'),
    check('address.*.pincode'),
    check('address.*.city_id').isInt({ min: 1 }).withMessage('Invalid city_id'),
    check('address.*.flat'),
    check('address.*.landmark'),
    (req, res, next) => {
      validationResult(req, res, next)
    }
]