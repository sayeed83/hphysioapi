const model = require('../models/user')
const uuid = require('uuid')
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const db = require('../middleware/db')
const emailer = require('../middleware/emailer');
let successData = {message: 'Success', totalRecord: 0, data: [], status: 200}
let errorData = {message: 'Error', totalRecord: 0, data: [], status: 400}

/*********************
 * Private functions *
 *********************/

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const createItem = async (req) => {
  return new Promise((resolve, reject) => {
    resolve(true);
  })
}

/********************
 * Public functions *
 ********************/

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItems = async (req, res) => {
  try {
    const query = `select * from USERS`;
    let tempData = await utils.executeQuery(query);
    successData.data = tempData;
    successData.totalRecord = tempData.length;
    res.status(200).json(successData);
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
  try {
    req = matchedData(req)
    // const id = await utils.isIDGood(req.id)
    // res.status(200).json(await db.getItem(id, model))
    const query = `select * from USERS WHERE id = ${req.id}`;
    let tempData = await utils.executeQuery(query);
    successData.data = tempData;
    successData.totalRecord = tempData.length;
    res.status(200).json(successData);
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateItem = async (req, res) => {
  try {
    req = matchedData(req);
    let query = `UPDATE USERS SET full_name = '${req.fullName}', mobile_no = ${req.mobileNumber} WHERE (id = ${req.id});
    `;
    await utils.executeQuery(query);
    res.status(200).json(successData);
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.createItem = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    req = matchedData(req)
    const doesEmailExists = await emailer.emailExists(req.email)
    if (!doesEmailExists) {
      const item = await createItem(req)
      emailer.sendRegistrationEmailMessage(locale, item)
      res.status(201).json(item)
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteItem = async (req, res) => {
  try {
    req = matchedData(req)
    res.status(200).json(successData);
  } catch (error) {
    utils.handleError(res, error)
  }
}
