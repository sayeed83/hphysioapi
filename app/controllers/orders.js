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
    let ref_table='';
    if(req.type == 1) {
      ref_table = 'patient_services'; 
    } else {
      ref_table = 'my_subscription'; 
    }

    let insertQeury = `INSERT INTO transactions(
      user_id,
      reference_id,
      ref_table,
      amount,
      txn_ref_no,
      txn_date,
      txn_status,
      created_at,
      updated_at
    ) VALUES(
      '${req?.user_id}',
      '${req?.reference_id}',
      '${ref_table}',
      '${req?.amount}',
      '${req?.order_id}',
      '${date}',
      '${req?.status}',
      '${created_at}',
      '${created_at}'
      )`;
    let temData = await utils.executeQuery(insertQeury);
    // return new Promise(async (resolve, reject) => {
    //   let date = moment().format("YYYY-MM-DD");
    //   let created_at = moment().format("YYYY-MM-DD HH:mm:ss");
    //   const query1 = `SELECT * FROM transactions WHERE id='${temData.insertId}' LIMIT 1`;
    //   let tempData1 = await utils.executeQuery(query1);
    //   if(tempData1[0]['txn_status'] == 'Success') {
    //     const infoSub = `SELECT * FROM subscription_plan WHERE id='${tempData1[0]['subscription_id']}' LIMIT 1`;
    //     let subData = await utils.executeQuery(infoSub);
    //     let expirydate = moment(date).add(subData[0]['validity'],'M').format("YYYY-MM-DD");

    //     const insertSub = `INSERT INTO my_subscription(
    //       user_id,
    //       subscription_id,
    //       validity,
    //       price,
    //       start_date,
    //       end_date,
    //       transaction_id,
    //       created_at
    //     ) VALUES(
    //       '${req.user_id}',
    //       '${req.subscription_id}',
    //       '${subData[0]['validity']}',
    //       '${req.amount}',
    //       '${date}',
    //       '${expirydate}',
    //       '${tempData1[0]['id']}',
    //       '${created_at}'
    //     )`;
    //     await utils.executeQuery(insertSub);

    //     const updatequery = `UPDATE users SET payment_status='2' WHERE id='${tempData1[0]['user_id']}'`;        
    //     await utils.executeQuery(updatequery);
    //   }
    // resolve(temData.insertId);
    // })
    
    res.status(200).json(successData);
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.paymentSuccess = async (req, res) => {
  try {
    const locale = req.getLocale()
    req = matchedData(req)
    if(req.status == 'Success' && req.type == 2) {

      var created_at = moment().format('YYYY-MM-DD HH:mm:ss');
      const query1 = `SELECT * FROM transactions WHERE txn_ref_no='${req.order_id}' LIMIT 1`;
      let tempData1 = await utils.executeQuery(query1);
      const infoSub = `SELECT * FROM subscription_plan WHERE id='${req.reference_id}' LIMIT 1`;
      let subData = await utils.executeQuery(infoSub);
      let date = moment().format("YYYY-MM-DD");
      let expirydate = moment().add(subData[0]['validity'],'M').format("YYYY-MM-DD");
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
        '${req.reference_id}',
        '${subData[0]['validity']}',
        '${req.amount}',
        '${date}',
        '${expirydate}',
        '${tempData1[0]['id']}',
        '${created_at}'
      )`;
      await utils.executeQuery(insertSub);

      const updatequery = `UPDATE users SET payment_status='2', free_expired='0' WHERE id='${tempData1[0]['user_id']}'`;        
      await utils.executeQuery(updatequery);
      const updatequery1 = `UPDATE transactions SET txn_status='Success' WHERE id='${tempData1[0]['id']}'`;        
      await utils.executeQuery(updatequery1);
    
      res.status(200).json(successData);
    } else if(req.status == 'Success' && req.type == 1) {
      const query1 = `SELECT * FROM transactions WHERE txn_ref_no='${req.order_id}' LIMIT 1`;
      let tempData1 = await utils.executeQuery(query1);
    //   console.log(" tempData1 ", tempData1);
      const updatequery1 = `UPDATE transactions SET txn_status='Success' WHERE txn_ref_no='${req.order_id}'`;        
      await utils.executeQuery(updatequery1);

      const updatequery2 = `UPDATE patient_services SET transaction_id='${tempData1[0]['id']}' WHERE id='${req.reference_id}'`;        
      await utils.executeQuery(updatequery2);
      res.status(200).json(successData);
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}
exports.paymentFailed = async (req, res) => {
  try {
    const locale = req.getLocale()
    req = matchedData(req)

    var created_at = moment().format('YYYY-MM-DD HH:mm:ss');
    
    const updatequery1 = `UPDATE transactions SET txn_status='${req.status}',updated_at='${created_at}' WHERE txn_ref_no='${req.order_id}'`;        
    await utils.executeQuery(updatequery1);
  
    res.status(200).json(successData);
    
  } catch (error) {
    utils.handleError(res, error)
  }
}