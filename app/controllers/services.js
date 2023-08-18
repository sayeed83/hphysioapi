const model = require('../models/city')
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const db = require('../middleware/db')
let successData = {message: 'Success', totalRecord: 0, data: [], status: 200};
const NULL_VALUE = null;

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

exports.addPhysioServiceAddress = async (req, res) => {
    try {
        req = matchedData(req);
        let deleteQuery = `DELETE FROM service_address WHERE user_id = ${req.user_id}`;
        await utils.executeQuery(deleteQuery);
        for (let index = 0; index < req['address'].length; index++) {
            const addEl = req['address'][index];
            let query = `INSERT INTO service_address (user_id, default_address, full_address, area_id, city_id) 
            VALUES (${addEl.user_id}, 0, '${addEl?.full_address}', ${addEl.area_id}, ${addEl?.city_id})`;
            await utils.executeQuery(query); 
            
        }
        res.status(200).json(successData); 
        
    } catch (error) {
        utils.handleError(res, error)
    }
}

exports.getServiceAddress = async (req, res) => {
    try {
        const query = `SELECT
                sa.id,
                sa.flat,
                sa.landmark,
                sa.user_id,
                sa.default_address,
                sa.full_address,
                sa.area_id,
                a.name area_name,
                sa.pincode,
                sa.city_id,
                c.cityName as city_name
            FROM
                service_address sa
                LEFT JOIN cities c ON c.cityID = sa.city_id
                LEFT JOIN area a ON a.id = sa.area_id
            WHERE user_id = ${req?.params?.user_id}`;
        let tempData = await utils.executeQuery(query);
        successData.data = tempData;
        successData.totalRecord = tempData.length;
        res.status(200).json(successData);
    } catch (error) {
      utils.handleError(res, error)
    }
}
