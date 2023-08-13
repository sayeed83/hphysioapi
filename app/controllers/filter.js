const model = require('../models/city')
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const db = require('../middleware/db')
const { json } = require('body-parser')
let successData = {message: 'Success', totalRecord: 0, data: [], status: 200}

/*********************
 * Private functions *
 *********************/

/**
 * Checks if a city already exists excluding itself
 * @param {string} id - id of item
 * @param {string} name - name of item
 */
const cityExistsExcludingItself = async (id, name) => {
  return new Promise((resolve, reject) => {
    model.findOne(
      {
        name,
        _id: {
          $ne: id
        }
      },
      (err, item) => {
        utils.itemAlreadyExists(err, item, reject, 'CITY_ALREADY_EXISTS')
        resolve(false)
      }
    )
  })
}

/**
 * Checks if a city already exists in database
 * @param {string} name - name of item
 */
const cityExists = async (name) => {
  return new Promise((resolve, reject) => {
    model.findOne(
      {
        name
      },
      (err, item) => {
        utils.itemAlreadyExists(err, item, reject, 'CITY_ALREADY_EXISTS')
        resolve(false)
      }
    )
  })
}

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

exports.getHomedata = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
      const locale = req.getLocale()
      req = matchedData(req)

      const query = `select *
      from category`;
      
      let tempData = await utils.executeQuery(query);
      let arr = [];
      // Array.prototype.forEach.call(tempData, element => {
      //   console.log(element)
      //   const query1 = `select ps.id,ps.service_id,s.name as service_name,ps.cat_id,ps.user_id,ps.booking_date,ps.booking_time,ps.booking_status,u.full_name,u.email,u.mobile_no,u.dob,u.city,u.state,u.address,u.status_id,ps.created_at,ps.updated_at
      //                 from patient_services  as ps 
      //                 LEFT JOIN users as u 
      //                 ON ps.user_id = u.id
      //                 LEFT JOIN services as s 
      //                 ON ps.service_id = s.id
                      
      //                 WHERE partner_id = ${req.user_id} AND ps.cat_id = ${element.id}`;
      //   let tempData1 = await utils.executeQuery(query1);
      //   let arr1 = [];
      //   Array.prototype.forEach.call(tempData1, newelement => {
      //     arr1.push({
      //       'id':newelement.id,
      //       'service_name':newelement.service_name
      //     });
      //   })
      //   arr.push({
      //     'id':element.id,
      //     'cat_name':element.cat_name,
      //     'patient_services':arr1,
      //   });
      // });
      await Promise.all(tempData.map(async (element) => {
        const query1 = `select ps.id,ps.service_id,s.name as service_name,ps.cat_id,ps.user_id,ps.booking_date,ps.booking_time,ps.booking_status,u.full_name,u.email,u.mobile_no,u.dob,u.city,u.state,u.address,u.status_id,ps.created_at,ps.updated_at
                      from patient_services  as ps 
                      LEFT JOIN users as u 
                      ON ps.user_id = u.id
                      LEFT JOIN services as s 
                      ON ps.service_id = s.id
                      
                      WHERE partner_id = ${req.user_id} AND ps.cat_id = ${element.id}`;
        let tempData1 = await utils.executeQuery(query1);
        let arr1 = [];
        await Promise.all(tempData1.map(async (newelement) => {
          let status = '';
          if (newelement.booking_status == 1) {
            status = 'Incomplete';
          } else {
            status = 'Completed';            
          }

          arr1.push({
                  'id':newelement.id,
                  'service_id':newelement.service_id,
                  'service_name':newelement.service_name,
                  'booing_status':status,
                  'user_id':newelement.user_id,
                  'full_name':newelement.full_name,
                  'email':newelement.email,
                  'mobile':newelement.mobile,
                  'dob':newelement.dob,
                  'city':newelement.city,
                  'state':newelement.state,
                  'address':newelement.address,
                });
        }));
        arr.push({
          'id':element.id,
          'cat_name':element.cat_name,
          'patient_services':arr1,
        });
        
      }));
        console.log(arr);
      successData.data = arr;
      successData.totalRecord = tempData.length;
      res.status(200).json(successData);

      
    
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.getfilterdata = async (req, res) => {
  try {
    const locale = req.getLocale()
    req = matchedData(req)
    let filter = ``;
    if(req?.filter == 1) { // High to low
      filter = `ORDER BY tp.service_charge DESC`;
    } else if (req?.filter == 2) { // Low to high
      filter = `ORDER BY tp.service_charge ASC`;    
    }
    let price_range = ``;
    if(req?.from && req?.to) { // Prive Range
      price_range = `tp.service_charge >= ${req?.from} AND tp.service_charge <= ${req?.to}`;
    } 
    // if(req?.uid) {
    //   query1 = `SELECT * FROM therapist_pref as tp LEFT JOIN users as u ON tp.user_id=u.id WHERE u.id=${req.uid}`;
    // } else {
    //   query1 = `SELECT * FROM therapist_pref as tp LEFT JOIN users as u ON tp.user_id=u.id WHERE service_id='${req?.service_id}' AND u.full_name like '%${req?.search_field || ''}%' AND ${price_range} ${filter}`;      
    // }
    let uidFilter = ``;
    if(req?.uid) {
        uidFilter = ` AND u.id=${req.uid}`;
    }
    

    let query1 = `SELECT
            u.full_name,
            u.rating,
            tp.service_id,
            tp.service_charge,
            tp.id,
            s.name as service_name,
            u.mobile_no
        FROM therapist_pref AS tp
        LEFT JOIN users AS u ON tp.user_id = u.id
        LEFT JOIN services AS s ON s.id = tp.service_id
        WHERE service_id='${req?.service_id}' AND u.full_name like '%${req?.search_field || ''}%' AND ${price_range} ${uidFilter} ${filter}
    `;
        console.log(" query1 ", query1);
    let tempData1 = await utils.executeQuery(query1);
    let arr1 = []
    await Promise.all(tempData1?.map(async (nlist) => {
      arr1.push({
        'id': nlist?.id,
        'service_charge': nlist?.service_charge,
        'name': nlist?.full_name ?? '',
        'service_id': nlist?.service_id,
        'mobile_no': nlist?.mobile_no,
        'rating': nlist?.rating
      })
    }));

    successData.data = arr1;


    successData.totalRecord = arr1.length;
    res.status(200).json(successData);

  } catch (error) {
    utils.handleError(res, error)
  }
}