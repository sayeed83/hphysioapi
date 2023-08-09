const model = require('../models/user')
const utils = require('../middleware/utils')
const { matchedData } = require('express-validator')
const auth = require('../middleware/auth')

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
      req = matchedData(req)
      await saveProfilePhoto(req.user_id,req.profile_photo);
      res.status(200).json(userId)
    } catch (error) {
      utils.handleError(res, error)
    }
}

const saveProfilePhoto = async (userId, base64Data) => {
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
    let filePath = `documents/profile/${userId}_${base64Data}.${type}`; //userId+"_"+base64Data.degree_id;
    return new Promise(async (resolve, reject) => {
        fs.writeFile(filePath, buf, (err) => {
            if (err) return reject(err);
            resolve(filePath);
        });
        
    })
    
}
