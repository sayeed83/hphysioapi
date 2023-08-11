const model = require('../models/user')
const utils = require('../middleware/utils')
const { matchedData } = require('express-validator')
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path'); // Import the 'path' module
let successData = {message: 'Success', totalRecord: 0, data: [], status: 200}


/*********************
 * Private functions *
 *********************/

/**
 * Gets profile from database by id
 * @param {string} id - user id
 */
const getProfileFromDB = async (id) => {
  return new Promise((resolve, reject) => {
    model.findById(id, '-_id -updatedAt -createdAt', (err, user) => {
      utils.itemNotFound(err, user, reject, 'NOT_FOUND')
      resolve(user)
    })
  })
}

/**
 * Updates profile in database
 * @param {Object} req - request object
 * @param {string} id - user id
 */
const updateProfileInDB = async (req, id) => {
  return new Promise((resolve, reject) => {
    model.findByIdAndUpdate(
      id,
      req,
      {
        new: true,
        runValidators: true,
        select: '-role -_id -updatedAt -createdAt'
      },
      (err, user) => {
        utils.itemNotFound(err, user, reject, 'NOT_FOUND')
        resolve(user)
      }
    )
  })
}

/**
 * Finds user by id
 * @param {string} email - user id
 */
const findUser = async (id) => {
  return new Promise((resolve, reject) => {
    model.findById(id, 'password email', (err, user) => {
      utils.itemNotFound(err, user, reject, 'USER_DOES_NOT_EXIST')
      resolve(user)
    })
  })
}

/**
 * Build passwords do not match object
 * @param {Object} user - user object
 */
const passwordsDoNotMatch = async () => {
  return new Promise((resolve) => {
    resolve(utils.buildErrObject(409, 'WRONG_PASSWORD'))
  })
}

/**
 * Changes password in database
 * @param {string} id - user id
 * @param {Object} req - request object
 */
const changePasswordInDB = async (id, req) => {
  return new Promise((resolve, reject) => {
    model.findById(id, '+password', (err, user) => {
      utils.itemNotFound(err, user, reject, 'NOT_FOUND')

      // Assigns new password to user
      user.password = req.newPassword

      // Saves in DB
      user.save((error) => {
        if (err) {
          reject(utils.buildErrObject(422, error.message))
        }
        resolve(utils.buildSuccObject('PASSWORD_CHANGED'))
      })
    })
  })
}

/********************
 * Public functions *
 ********************/

/**
 * Get profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getProfile = async (req, res) => {
  try {
    const id = await utils.isIDGood(req.user._id)
    res.status(200).json(await getProfileFromDB(id))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateProfile = async (req, res) => {
  try {
    const id = await utils.isIDGood(req.user._id)
    req = matchedData(req)
    res.status(200).json(await updateProfileInDB(req, id))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Change password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.changePassword = async (req, res) => {
  try {
    const id = await utils.isIDGood(req.user._id)
    const user = await findUser(id)
    req = matchedData(req)
    const isPasswordMatch = await auth.checkPassword(req.oldPassword, user)
    if (!isPasswordMatch) {
      utils.handleError(res, await passwordsDoNotMatch())
    } else {
      // all ok, proceed to change password
      res.status(200).json(await changePasswordInDB(id, req))
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.profilePhoto = async (req, res) => {
    try {
      req = matchedData(req);
      await saveProfilePhoto(req.user_id,req.profile_photo);
      res.status(200).json(successData)
    } catch (error) {
      utils.handleError(res, error)
    }
}

const saveProfilePhoto = async (userId, base64Data) => {
    const imageStoragePath = path.join(__dirname, '../../documents/', 'profile');
    // const imageStoragePath = path.join(__dirname, 'images'); 
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const filename = `${userId}.jpg`;
    const filePath = path.join(imageStoragePath, filename); // Combine directory path and filename

    fs.writeFile(filePath, imageBuffer, (err) => {
        if (err) {
            console.log(" Error ", err);
        //   res.status(500).send('Error uploading image.');
        } else {
            return;
        //   res.send('Image uploaded successfully.');
        }
    });
    
}

exports.updatePreferences = async (req, res) => {
    try {
        req = matchedData(req);
        let updatedData =  await updatePreferencesFunc(req.user_id, req.preferences);
        successData.data = updatedData;
        res.status(200).json(successData);
    } catch (error) {
      utils.handleError(res, error)
    }
}

const updatePreferencesFunc = async (userId, preferences) => {
    let tempInsertArray = [];
    for (let index = 0; index < preferences.length; index++) {
        let tmpData = {};
        // if(preferences[index].checked) {
            tmpData.user_id = userId;
            tmpData.service_id = preferences[index].id;
            tmpData.service_charge = preferences[index].value;
            tmpData.active = preferences[index].checked ? 1 : 0;
            tempInsertArray.push(tmpData);
        // }
    }
    // let keys = Object.keys(tempInsertArray[0]);
    // let values = tempInsertArray.map(obj => keys.map(key => obj[key]));
    // let sql = 'INSERT INTO therapist_pref(' + keys.join(',') + ') VALUES ? ';
    // return new Promise(async (resolve, reject) => {
    //     let temData = await utils.executeQuery(sql, values);
    //     resolve(temData);
    // })

    let keys = Object.keys(tempInsertArray[0]);
    let values = tempInsertArray.map(obj => keys.map(key => obj[key]));

    let sql = 'INSERT INTO therapist_pref(`' + keys.join('`,`') + '`) VALUES ? ';
    sql += ` ON DUPLICATE KEY UPDATE 
        active=values(active),
        service_charge=values(service_charge),
        user_id=values(user_id),
        service_id=values(service_id)
    `;
    await utils.executeQuery(sql, values);
    const therapistQuery = `
      SELECT
            tp.id,
            tp.user_id,
            tp.service_id,
            tp.service_charge,
            s.name
        FROM therapist_pref tp
        LEFT JOIN services s ON tp.service_id = s.id
        WHERE tp.user_id = ${userId} AND tp.active = 1
      `;
    let tempTherapistData = await utils.executeQuery(therapistQuery);
    return tempTherapistData;

    // let test = con.query(sql, [values], async function (error, result, fields) {
    //     if (error) {
    //         reject(error)
    //     }
    //     var rowIds = [];
    //     if(result && result.insertId) {
    //         for (var i = result.insertId; i < result.insertId + result.affectedRows; i++) {
    //             rowIds.push(i);
    //         }
    //     }
    //     resolve(rowIds);
    // });
}
