const model = require('../models/city')
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const db = require('../middleware/db')
let successData = {message: 'Success', totalRecord: 0, data: [], status: 200}

/**
 * Gets all items from database
 */
const getAllItemsFromDB = async () => {
  return new Promise((resolve, reject) => {
    model.find(
      {},
      '-updatedAt -createdAt',
      {
        sort: {
          name: 1
        }
      },
      (err, items) => {
        if (err) {
          reject(utils.buildErrObject(422, err.message))
        }
        resolve(items)
      }
    )
  })
}

/********************
 * Public functions *
 ********************/

/**
 * Get all items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getAllItems = async (req, res) => {
  try {
    res.status(200).json(await getAllItemsFromDB())
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getAllItems = async (req, res) => {
  try {
    const query = `select * from services`;
    let tempData = await utils.executeQuery(query);
    successData.data = tempData;
    successData.totalRecord = tempData.length;
    res.status(200).json(successData);
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.addPatientServiceAddress = async (req, res) => {
    try {
        req = matchedData(req)
       console.log(" req ", req);
       if(req.default_address) {
            let updateQuery = `UPDATE service_address SET default_address = 0 WHERE user_id = ${req.user_id}`;
            await utils.executeQuery(updateQuery);
       }
       let query = `INSERT INTO service_address (user_id, default_address, full_address, area_id, pincode, city_id, flat, landmark) 
       VALUES (${req.user_id}, ${req.default_address}, '${req.full_address}', ${req.area_id}, '${req.pincode}', ${req.city_id}, '${req.flat}', '${req.landmark}')`;
       await utils.executeQuery(query);
       res.status(200).json(successData);
    } catch (error) {
      utils.handleError(res, error)
    }
}
