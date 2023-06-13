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
      let date = moment().format("YYYY-MM-DD");
      let created_at = moment().format("YYYY-MM-DD HH:mm:ss");
      let temData = await utils.executeQuery(insertQeury);
      const query1 = `SELECT * FROM transactions WHERE id='${temData.insertId}' LIMIT 1`;
      let tempData1 = await utils.executeQuery(query1);
      if(tempData1[0]['txn_status'] == 'Success') {
        const infoSub = `SELECT * FROM subscription_plan WHERE id='${tempData1[0]['subscription_id']}' LIMIT 1`;
        let subData = await utils.executeQuery(infoSub);
        let expirydate = moment(date).add(subData[0]['validity'],'M').format("YYYY-MM-DD");

        const insertSub = `INSERT INTO my_subscription(
          user_id,
          subscription_id,
          validity,
          price,
          start_date,
          end_date,
          transaction_id,
          created_at
        ) VALUES(
          '${req.user_id}',
          '${req.subscription_id}',
          '${subData[0]['validity']}',
          '${req.amount}',
          '${date}',
          '${expirydate}',
          '${temData.insertId}',
          '${created_at}'
        )`;
        await utils.executeQuery(insertSub);

        const updatequery = `UPDATE users SET payment_status='2' WHERE id='${tempData1[0]['user_id']}'`;        
        await utils.executeQuery(updatequery);
      }
      res.status(200).json(successData);
      // resolve(temData.insertId);
    })

  } catch (error) {
    utils.handleError(res, error)
  }
}