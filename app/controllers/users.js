const model = require('../models/user')
const uuid = require('uuid')
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const db = require('../middleware/db')
const emailer = require('../middleware/emailer');
let successData = {message: 'Success', totalRecord: 0, data: [], status: 200}
let errorData = {message: 'Error', totalRecord: 0, data: [], status: 400}
const fs = require('fs');

/*********************
 * Private functions *
 *********************/

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const createUser = async (req) => {
    // console.log(" req ==== ", req);
    let insertQeury = `INSERT INTO users(
        first_name,
        middle_name,
        last_name,
        full_name,
        email,
        mobile_no,
        dob,
        city,
        state,
        address,
        password,
        degree,
        specialization,
        sate_of_practice,
        council_registration_number,
        pan_number,
        pan_verified,
        aadhar_number,
        aadhar_verified,
        status_id,
        usertype_id,
        created_at,
        updated_at,
        deleted_at
    )
    VALUES(
        '${req.first_name}',
        '${req.middle_name}',
        '${req.last_name}',
        '${req.first_name} ${req.middle_name} ${req.last_name}',
        '${req.email}',
        '${req.mobile_no}',
        '${req.dob}',
        '${req.city}',
        '${req.state}',
        '${req.address}',
        '${req.password}',
        '${req.degree}',
        '${req.specialization}',
        '${req.sate_of_practice}',
        '${req.council_registration_number}',
        '${req.pan_number}',
        '${1}',
        '${req.aadhar_number}',
        '${1}',
        '1',
        '${req.userType == 'Therapist' ? '2' : '1'}',
        '2023-05-12 16:36:35',
        '2023-05-12 16:36:35',
        NULL
    );`;
    return new Promise(async (resolve, reject) => {
        let temData = await utils.executeQuery(insertQeury);
        // console.log(" temData ==== ", temData.insertId);
        resolve(temData.insertId);
    })
}

const createPreference = async (userId, preferences) => {
    let tempArray = [];
    for (let index = 0; index < preferences.length; index++) {
        let tmpData = {};
        if(preferences[index].checked) {
            tmpData.user_id = userId;
            tmpData.service_id = preferences[index].id;
            tmpData.service_charge = preferences[index].value;
            tempArray.push(tmpData);
        }
    }
    let keys = Object.keys(tempArray[0]);
    let values = tempArray.map(obj => keys.map(key => obj[key]));
    let sql = 'INSERT INTO therapist_pref (' + keys.join(',') + ') VALUES ? ';
    return new Promise(async (resolve, reject) => {
        let temData = await utils.executeQuery(sql, values);
        resolve(temData);
    })
}

const saveBase64Image = async (userId, base64Data) => {
    console.log(" base64Data ", base64Data.degree_id);
    let attachment = base64Data.base64._z;
    let type = attachment.split(';')[0].split('/')[1];
    let buf = null;
    if(attachment.split(';')[0].split('/')[1] != 'pdf') {
        type = 'jpg';
        contentType = 'image/jpeg';
        buf = Buffer.from(attachment.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    } 
    if(attachment.split(';')[0].split('/')[1] == 'pdf') {
        buf = Buffer.from(attachment.replace(/^data:application\/pdf;base64,/, ''), 'base64');
    }
    attachment = new Date().getTime() + "_" + userId + "."+type;
    let filePath = `documents/therapist/${userId}_${base64Data.degree_id}.${type}`; //userId+"_"+base64Data.degree_id;
    return new Promise(async (resolve, reject) => {
        fs.writeFile(filePath, buf, (err) => {
            if (err) return reject(err);
            resolve(filePath);
        });
        
    })
    
}

const createDocument = async (userId, docs) => {
    let tempArray = [];
    for (let index = 0; index < docs.length; index++) {
        let filePath = await saveBase64Image(userId, docs[index]);
        let tmpData = {};
        if(filePath) {
            tmpData.degree_id = docs[index].degree_id;
            tmpData.file_path = filePath;
            tmpData.user_id = userId;
            tempArray.push(tmpData);
        }
        // console.log(" filePath ", filePath);
    }
    let keys = Object.keys(tempArray[0]);
    let values = tempArray.map(obj => keys.map(key => obj[key]));
    let sql = 'INSERT INTO documents (' + keys.join(',') + ') VALUES ? ';
    return new Promise(async (resolve, reject) => {
        let temData = await utils.executeQuery(sql, values);
        resolve(temData);
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
    const query = `select * from users`;
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
    const query = `select * from users WHERE id = ${req.id}`;
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
 * Change Mobile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.changeMobile = async (req, res) => {
  try {
    req = matchedData(req);
    let query = `UPDATE USERS SET mobile_no = '${req.mobile_no}' WHERE id = ${req.user_id}`;
    await utils.executeQuery(query);
    res.status(200).json(successData);
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.updateProfile = async (req, res) => {
  try {
    req = matchedData(req);
    let query = `UPDATE USERS SET full_name = '${req.name}',dob='${req.dob}',city='${req.city}',state='${req.state}',address='${req.address}' WHERE id = ${req.user_id}`;
    await utils.executeQuery(query);
    res.status(200).json(successData);
  } catch (error) {
    utils.handleError(res, error)
  }
}
exports.changeEmail = async (req, res) => {
  try {
    req = matchedData(req);
    let query = `UPDATE USERS SET email = '${req.email}' WHERE id = ${req.user_id}`;
    await utils.executeQuery(query);
    res.status(200).json(successData);
  } catch (error) {
    utils.handleError(res, error)
  }
}
exports.changePassword = async (req, res) => {
  try {
    req = matchedData(req);
    let query = `UPDATE USERS SET password = '${req.password}' WHERE id = ${req.user_id}`;
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
    const locale = req.getLocale();
    req = matchedData(req);
    // console.log(" req ---- ", req);
    const doesEmailExists = await emailer.emailExists(req.email)
    if (!doesEmailExists) {
        // console.log(" req.preferences ", req.preferences);
        const userId = await createUser(req);
        if(userId) {
            if(req.preferences) {
                await createPreference(userId, req.preferences);
            }
            if(req.docs) {
                await createDocument(userId, req.docs);
            }
            
        }
        //   emailer.sendRegistrationEmailMessage(locale, item)
        res.status(200).json(userId)
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
