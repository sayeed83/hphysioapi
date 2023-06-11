const model = require('../models/city')
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const db = require('../middleware/db')
const { json } = require('body-parser')
const moment = require('moment');
let successData = {message: 'Success', totalRecord: 0, data: [], status: 200}

// Create Order Api
exports.createOrder = async (req, res) => {
  try {
    const locale = req.getLocale()
    req = matchedData(req)
    var created_at = moment().format('YYYY-MM-DD HH:mm:ss');
    var date = moment().format('YYYY-MM-DD');

    let insertQeury = `INSERT INTO transactions(
      user_id,
      subscription_id,
      amount,
      txn_ref_no,
      txn_date,
      txn_status,
      created_at,
      updated_at
    ) VALUES(
      '${req?.user_id}',
      '${req?.subscription_id}',
      '${req?.amount}',
      '${req?.order_id}',
      '${date}',
      '${req?.status}',
      '${created_at}',
      '${created_at}'
    )`;
    return new Promise(async (resolve, reject) => {
      let temData = await utils.executeQuery(insertQeury);
      console.log(" temData ==== ", temData.insertId);
      // return successData;
      res.status(200).json(successData);
      // resolve(temData.insertId);
    })

  } catch (error) {
    utils.handleError(res, error)
  }
}