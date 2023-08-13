const model = require('../models/city')
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const db = require('../middleware/db')
const { json } = require('body-parser')
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
        const query1 = `select ps.id,ps.service_id,s.name as service_name,ps.cat_id,ps.user_id,ps.booking_date,ps.booking_time,ps.booking_status,ps.price,u.full_name,u.email,u.mobile_no,u.dob,u.city,u.state,u.address,u.status_id,ps.created_at,ps.updated_at
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
                  'price': newelement.price
                });
        }));
        arr.push({
          'id':element.id,
          'cat_name':element.cat_name,
          'patient_services':arr1,
        });
        
      }));
        successData.data = arr;
        successData.totalRecord = tempData.length;
        res.status(200).json(successData);

      
    
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.submitrequest = async (req, res) => {
  try {
    const locale = req.getLocale()
    req = matchedData(req);
    const query = `select service_charge from therapist_pref where service_id = ${req?.service_id} AND user_id = ${req?.partner_id}`;
    console.log(" query ", query);
    let tempData = await utils.executeQuery(query);
    // console.log(" tempData ", tempData);
    // res.status(200).json(successData);
    const otp_code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    console.log(" otp_code ", otp_code);
    let insertQeury = `INSERT INTO patient_services(
                        service_id,
                        partner_id,
                        user_id,
                        cat_id,
                        price,
                        otp_code,
                        booking_date,
                        booking_time,
                        description,
                        transaction_id,
                        booking_status,
                        created_at,
                        updated_at
                      ) VALUES(
                        '${req?.service_id}',
                        '${req?.partner_id}',
                        '${req?.user_id}',
                        '${req?.cat_id}',
                        ${tempData[0].service_charge},
                        ${otp_code},
                        '${req?.booking_date}',
                        '${req?.booking_time}',
                        '${req?.description}',
                        NULL,
                        '1',
                        '2023-05-12 16:36:35', 
                        '2023-05-12 16:36:35'
                      )`;
    return new Promise(async (resolve, reject) => {
      let temData = await utils.executeQuery(insertQeury);
      temData.otp_code = otp_code;
      res.status(200).json(temData);
    //   resolve(temData.insertId);
    })
  } catch (error) {
    utils.handleError(res, error)
  }
}

// get partner request by :id
exports.updateRequestStatus = async (req, res) => {
  try {
    req = matchedData(req)
    let query = `UPDATE patient_services SET booking_status = '${req.status}' WHERE id = ${req.id} AND otp_code = ${req.otp_code}`;
      let response = await utils.executeQuery(query);
        //   console.log(" response ", response.affectedRows);
      successData.affectedRows = response.affectedRows;
      res.status(200).json(successData);
  } catch (error) {
    utils.handleError(res, error)
  }
}
