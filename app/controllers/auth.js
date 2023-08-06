const jwt = require('jsonwebtoken')
const User = require('../models/user')
const UserAccess = require('../models/userAccess')
const ForgotPassword = require('../models/forgotPassword')
const utils = require('../middleware/utils')
const uuid = require('uuid')
const { addHours } = require('date-fns')
const { matchedData } = require('express-validator')
const auth = require('../middleware/auth')
const emailer = require('../middleware/emailer')
const moment = require('moment')
const successData = {
  message: 'Success',
  totalRecord: 0,
  data: [],
  status: 200
}
const failedData = {
  message: 'Faild',
  totalRecord: 0,
  data: [],
  status: 401,
  message: 'Something went wrong!'
}
const HOURS_TO_BLOCK = 2
const LOGIN_ATTEMPTS = 5

/*********************
 * Private functions *
 *********************/

/**
 * Generates a token
 * @param {Object} user - user object
 */
const generateToken = (user) => {
  // Gets expiration time
  const expiration =
    Math.floor(Date.now() / 1000) + 60 * process.env.JWT_EXPIRATION_IN_MINUTES

  // returns signed and encrypted token
  return auth.encrypt(
    jwt.sign(
      {
        data: {
          _id: user
        },
        exp: expiration
      },
      process.env.JWT_SECRET
    )
  )
}

/**
 * Creates an object with user info
 * @param {Object} req - request object
 */
const setUserInfo = (req) => {
  let user = {
    name: req.fullName,
    email: req.email
  }
  // Adds verification for testing purposes
  if (process.env.NODE_ENV !== 'production') {
    user = {
      ...user,
      verification: req.verification
    }
  }
  return user
}

/**
 * Saves a new user access and then returns token
 * @param {Object} req - request object
 * @param {Object} user - user object
 */
const saveUserAccessAndReturnToken = async (req, user) => {
  return new Promise((resolve, reject) => {
    const userAccess = new UserAccess({
      email: user.email,
      ip: utils.getIP(req),
      browser: utils.getBrowserInfo(req),
      country: utils.getCountry(req)
    })
    userAccess.save((err) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      const userInfo = setUserInfo(user)
      // Returns data with access token
      resolve({
        token: generateToken(user._id),
        user: userInfo
      })
    })
  })
}

/**
 * Blocks a user by setting blockExpires to the specified date based on constant HOURS_TO_BLOCK
 * @param {Object} user - user object
 */
const blockUser = async (user) => {
  return new Promise((resolve, reject) => {
    user.blockExpires = addHours(new Date(), HOURS_TO_BLOCK)
    user.save((err, result) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      if (result) {
        resolve(utils.buildErrObject(409, 'BLOCKED_USER'))
      }
    })
  })
}

/**
 * Saves login attempts to dabatabse
 * @param {Object} user - user object
 */
const saveLoginAttemptsToDB = async (user) => {
  return new Promise((resolve, reject) => {
    user.save((err, result) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      if (result) {
        resolve(true)
      }
    })
  })
}

/**
 * Checks that login attempts are greater than specified in constant and also that blockexpires is less than now
 * @param {Object} user - user object
 */
const blockIsExpired = (user) =>
  user.loginAttempts > LOGIN_ATTEMPTS && user.blockExpires <= new Date()

/**
 *
 * @param {Object} user - user object.
 */
const checkLoginAttemptsAndBlockExpires = async (user) => {
  return new Promise((resolve, reject) => {
    // Let user try to login again after blockexpires, resets user loginAttempts
    if (blockIsExpired(user)) {
      user.loginAttempts = 0
      user.save((err, result) => {
        if (err) {
          reject(utils.buildErrObject(422, err.message))
        }
        if (result) {
          resolve(true)
        }
      })
    } else {
      // User is not blocked, check password (normal behaviour)
      resolve(true)
    }
  })
}

/**
 * Checks if blockExpires from user is greater than now
 * @param {Object} user - user object
 */
const userIsBlocked = async (user) => {
  return new Promise((resolve, reject) => {
    if (user.blockExpires > new Date()) {
      reject(utils.buildErrObject(409, 'BLOCKED_USER'))
    }
    resolve(true)
  })
}

/**
 * Finds user by email
 * @param {string} email - user´s email
 */
const findUser = async (email) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email
      },
      'password loginAttempts blockExpires name email role verified verification',
      (err, item) => {
        utils.itemNotFound(err, item, reject, 'USER_DOES_NOT_EXIST')
        resolve(item)
      }
    )
  })
}

/**
 * Finds user by ID
 * @param {string} id - user´s id
 */
const findUserById = async (userId) => {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, item) => {
      utils.itemNotFound(err, item, reject, 'USER_DOES_NOT_EXIST')
      resolve(item)
    })
  })
}

/**
 * Adds one attempt to loginAttempts, then compares loginAttempts with the constant LOGIN_ATTEMPTS, if is less returns wrong password, else returns blockUser function
 * @param {Object} user - user object
 */
const passwordsDoNotMatch = async (user) => {
  user.loginAttempts += 1
  await saveLoginAttemptsToDB(user)
  return new Promise((resolve, reject) => {
    if (user.loginAttempts <= LOGIN_ATTEMPTS) {
      resolve(utils.buildErrObject(409, 'WRONG_PASSWORD'))
    } else {
      resolve(blockUser(user))
    }
    reject(utils.buildErrObject(422, 'ERROR'))
  })
}

/**
 * Registers a new user in database
 * @param {Object} req - request object
 */
const registerUser = async (req) => {
  return new Promise((resolve, reject) => {
    const user = {
      fullName: req.fullName,
      email: req.email,
      password: req.password,
      usertype_id: req.usertype_id,
      mobileNumber: req.mobileNumber,
      dob: req.dob,
      city: req.city,
      state: req.state,
      address: req.address,
      status_id: req.status_id,
    }

    var moment = require('moment');
    var created_at = moment().format('YYYY-MM-DD HH:mm:ss');
    let registerQuery = `
		INSERT INTO USERS (full_name, email, mobile_no, dob, city, state, address, password, status_id, usertype_id, created_at, updated_at) 
		VALUES ('${req.fullName}', '${req.email}', '${req.mobileNumber}', '${req.dob}', '${req.city}', '${req.state}','${req.address}','${req.password}','${req.status_id}','${req.usertype_id}','${created_at}','${created_at}');
	`;
    resolve(utils.executeQuery(registerQuery));
  })
}
/**
 * Registers a new user in database
 * @param {Object} req - request object
 */
const sendOtp = async (req) => {
  return new Promise((resolve, reject) => {
    const user = {
      send_to: req.send_to,
      type: req.type,
      reference: req.reference
    }
    // let otp = Math.floor((Math.random() * 10000));
    let otp = 123456;//utils.generateOTP();
    // var moment = require('moment');
    var created_at = moment().format('YYYY-MM-DD HH:mm:ss');
    let verifyOptQuery = `
		INSERT INTO verify_otp (user_id, send_to,type,otp,reference,created_at,updated_at) 
		VALUES (${req.user_id},'${req.send_to}', '${req.type}', '${otp}', '${req.reference}','${created_at}','${created_at}');
	`;
    let data = utils.executeQuery(verifyOptQuery);
    resolve(data);

  })
}

exports.sendOtp = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale();
    req = matchedData(req)
    const item = await sendOtp(req);
    if(item.insertId)
    {
      //   var id = item.insertId
      const query = `select * from verify_otp WHERE id = ${item.insertId}`;
      let tempData = await utils.executeQuery(query);
      successData.data = tempData;
      successData.totalRecord = tempData.length;
      res.status(200).json(successData);
    }

  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.verifyOtp = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale();
    req = matchedData(req)
    var id = req.id;
    var otp = req.otp;
    const query = `select * from verify_otp WHERE id = ${id} AND otp = ${otp}`;
    let tempData = await utils.executeQuery(query);
    if(tempData.length > 0)
    {
      const update_q = `update verify_otp SET status='1' WHERE id = ${id}`;
      let tempData1 = await utils.executeQuery(update_q);
      let updateSendTo = ``;
      if(req.type == 1) {
        updateSendTo += `SET mobile_no_verified=1, mobile_no='${req.send_to}'`
      }
      if(req.type == 2) {
        updateSendTo += `SET email_verified=1, email='${req.send_to}'`
      }
      const updateUserQuery = `update users ${updateSendTo} WHERE id = ${req.user_id}`;
      await utils.executeQuery(updateUserQuery);
      successData.data = tempData;
      successData.totalRecord = tempData.length;
      res.status(200).json(successData);
    } 
    else {
      res.status(201).json(failedData);
    }

  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.verifyMobile = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    req = matchedData(req)
    const query = `select id, mobile_no, mobile_no_verified from users WHERE mobile_no = '${req.mobile_no}' AND mobile_no_verified = 1`;
    let tempData = await utils.executeQuery(query);
    successData.totalRecord = tempData.length;
    successData.data = tempData;
    res.status(200).json(successData);

  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.verifyEmail = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    req = matchedData(req)
    const query = `select id, email from users WHERE email = '${req.email}' AND email_verified = 1`;
    let tempData = await utils.executeQuery(query);
    successData.totalRecord = tempData.length;
    successData.data = tempData;
    res.status(200).json(successData);

  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Builds the registration token
 * @param {Object} item - user object that contains created id
 * @param {Object} userInfo - user object
 */
const returnRegisterToken = (item, userInfo) => {
  if (process.env.NODE_ENV !== 'production') {
    userInfo.verification = item.verification
  }
  const data = {
    token: generateToken(item._id),
    user: userInfo
  }
  return data
}

/**
 * Checks if verification id exists for user
 * @param {string} id - verification id
 */
const verificationExists = async (id) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        verification: id,
        verified: false
      },
      (err, user) => {
        utils.itemNotFound(err, user, reject, 'NOT_FOUND_OR_ALREADY_VERIFIED')
        resolve(user)
      }
    )
  })
}

/**
 * Verifies an user
 * @param {Object} user - user object
 */
const verifyUser = async (user) => {
  return new Promise((resolve, reject) => {
    user.verified = true
    user.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      resolve({
        email: item.email,
        verified: item.verified
      })
    })
  })
}

/**
 * Marks a request to reset password as used
 * @param {Object} req - request object
 * @param {Object} forgot - forgot object
 */
const markResetPasswordAsUsed = async (req, forgot) => {
  return new Promise((resolve, reject) => {
    forgot.used = true
    forgot.ipChanged = utils.getIP(req)
    forgot.browserChanged = utils.getBrowserInfo(req)
    forgot.countryChanged = utils.getCountry(req)
    forgot.save((err, item) => {
      utils.itemNotFound(err, item, reject, 'NOT_FOUND')
      resolve(utils.buildSuccObject('PASSWORD_CHANGED'))
    })
  })
}

/**
 * Updates a user password in database
 * @param {string} password - new password
 * @param {Object} user - user object
 */
const updatePassword = async (password, user) => {
  return new Promise((resolve, reject) => {
    user.password = password
    user.save((err, item) => {
      utils.itemNotFound(err, item, reject, 'NOT_FOUND')
      resolve(item)
    })
  })
}

/**
 * Finds user by email to reset password
 * @param {string} email - user email
 */
const findUserToResetPassword = async (email) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email
      },
      (err, user) => {
        utils.itemNotFound(err, user, reject, 'NOT_FOUND')
        resolve(user)
      }
    )
  })
}

/**
 * Checks if a forgot password verification exists
 * @param {string} id - verification id
 */
const findForgotPassword = async (id) => {
  return new Promise((resolve, reject) => {
    ForgotPassword.findOne(
      {
        verification: id,
        used: false
      },
      (err, item) => {
        utils.itemNotFound(err, item, reject, 'NOT_FOUND_OR_ALREADY_USED')
        resolve(item)
      }
    )
  })
}

/**
 * Creates a new password forgot
 * @param {Object} req - request object
 */
const saveForgotPassword = async (req) => {
  return new Promise((resolve, reject) => {
    const forgot = new ForgotPassword({
      email: req.body.email,
      verification: uuid.v4(),
      ipRequest: utils.getIP(req),
      browserRequest: utils.getBrowserInfo(req),
      countryRequest: utils.getCountry(req)
    })
    forgot.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      resolve(item)
    })
  })
}

/**
 * Builds an object with created forgot password object, if env is development or testing exposes the verification
 * @param {Object} item - created forgot password object
 */
const forgotPasswordResponse = (item) => {
  let data = {
    msg: 'RESET_EMAIL_SENT',
    email: item.email
  }
  if (process.env.NODE_ENV !== 'production') {
    data = {
      ...data,
      verification: item.verification
    }
  }
  return data
}

/**
 * Checks against user if has quested role
 * @param {Object} data - data object
 * @param {*} next - next callback
 */
const checkPermissions = async (data, next) => {
  return new Promise((resolve, reject) => {
    User.findById(data.id, (err, result) => {
      utils.itemNotFound(err, result, reject, 'NOT_FOUND')
      if (data.roles.indexOf(result.role) > -1) {
        return resolve(next())
      }
      return reject(utils.buildErrObject(401, 'UNAUTHORIZED'))
    })
  })
}

/**
 * Gets user id from token
 * @param {string} token - Encrypted and encoded token
 */
const getUserIdFromToken = async (token) => {
  return new Promise((resolve, reject) => {
    // Decrypts, verifies and decode token
    jwt.verify(auth.decrypt(token), process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(utils.buildErrObject(409, 'BAD_TOKEN'))
      }
      resolve(decoded.data._id)
    })
  })
}

/********************
 * Public functions *
 ********************/

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.login = async (req, res) => {
  try {
    const data = matchedData(req);
    let WHERE = `u.password = '${data.password}'`;
    if(data.auth_by == 'email') {
      WHERE += ` AND u.email = '${data.user_name}'`;
    } 
    else if(data.auth_by == 'mobile') {
      WHERE += ` AND u.mobile_no = '${data.user_name}'`;
    }
    const userQuery = `select 
        u.id,
        u.first_name,
        u.middle_name,
        u.last_name,
        u.full_name,
        u.email,
        u.email_verified,
        u.mobile_no,
        u.mobile_no_verified,
        u.dob,
        u.state,
        u.address,
        u.degree,
        u.council_registration_number,
        u.pan_number,
        u.pan_verified,
        u.aadhar_number,
        u.aadhar_verified,
        u.specialization,
        u.payment_status,
        u.usertype_id,
        u.rating,
        ms.displayName specializationName,
        u.sate_of_practice,
        s.stateName,
        u.city,
        c.cityName,
        u.status_id,
        st.name status,
        u.usertype_id,
        ut.type userType,
        u.free_expired
    from users u 
    LEFT JOIN master_specialization ms ON ms.id = u.specialization
    LEFT JOIN states s ON s.stateID = u.sate_of_practice
    LEFT JOIN cities c ON c.cityID = u.city
    LEFT JOIN status st ON st.id = u.status_id
    LEFT JOIN usertype ut ON ut.id = u.usertype_id
    WHERE ${WHERE}`;
    let tmpUserData = await utils.executeQuery(userQuery);
    let tmpData = null;
    if(tmpUserData.length > 0) {
      tmpData = tmpUserData[0];
      const therapistQuery = `select tp.id,tp.user_id,tp.service_id,tp.service_charge,s.name from therapist_pref tp JOIN services s ON tp.user_id = s.id WHERE tp.user_id = ${tmpData.id}`;
      let tempTherapistData = await utils.executeQuery(therapistQuery);
      tmpData.preferences = tempTherapistData;

      const documentQuery = `select d.id,d.user_id,d.degree_id,d.file_path,md.displayName from documents d JOIN master_degrees md ON d.user_id = md.id WHERE d.user_id = ${tmpData.id}`;
      let tempDocumentData = await utils.executeQuery(documentQuery);
      for (let di = 0; di < tempDocumentData.length; di++) {
        const element = tempDocumentData[di];
        tempDocumentData[di].checked = true;
        tempDocumentData[di].value = '';

      }
      tmpData.docs = tempDocumentData;

      const serviceAddresQuery = `SELECT
                sa.id,
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
            WHERE user_id = ${tmpData.id}`;
      let tempserviceAddrestData = await utils.executeQuery(serviceAddresQuery);
      tmpData.service_address = tempserviceAddrestData;
    }
    successData.data = tmpData;

    if(tmpData) {
      successData.totalRecord = 1;
    }
     else {
      successData.totalRecord = 0;
      successData.message = 'Incorrect user name or password';
    }
    res.status(200).json(successData);

  } catch (error) {
    res.status(201).json(failedData);
  }
}

/**
 * Customer Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.cust_login = async (req, res) => {
  try {
    const data = matchedData(req)
    let WHERE = `u.password = '${data.password}' AND usertype_id='1'`
    if (data.auth_by == 'email') {
      WHERE += ` AND u.email = '${data.user_name}'`
    } else if (data.auth_by == 'mobile') {
      WHERE += ` AND u.mobile_no = '${data.user_name}'`
    }
    const userQuery = `select 
        u.id,
        u.first_name,
        u.middle_name,
        u.last_name,
        u.full_name,
        u.email,
        u.email_verified,
        u.mobile_no,
        u.mobile_no_verified,
        u.dob,
        u.state,
        u.address,
        u.city,
        ut.type userType
    from users as u
    LEFT JOIN usertype ut ON ut.id = u.usertype_id
    WHERE ${WHERE}`
    const tmpUserData = await utils.executeQuery(userQuery)
    let tmpData = null
    if (tmpUserData.length > 0) {
      tmpData = tmpUserData[0]
    }
    successData.data = tmpUserData
    console.log(tmpData);
    if (tmpData) {
      successData.totalRecord = 1
      successData.message = 'Success'
    } else {
      successData.totalRecord = 0
      successData.message = 'Incorrect user name or password'
    }
    res.status(200).json(successData)
  } catch (error) {
    res.status(201).json(failedData)
  }
}

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.register = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale();
    req = matchedData(req)
    const doesEmailExists = await emailer.emailExists(req.email);
    if (!doesEmailExists) {
      const item = await registerUser(req);
      const userInfo = setUserInfo(req);
      const response = returnRegisterToken(item, userInfo);
      emailer.sendRegistrationEmailMessage(locale, item);
      res.status(201).json(response);
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.verify = async (req, res) => {
  try {
    req = matchedData(req)
    const user = await verificationExists(req.id)
    res.status(200).json(await verifyUser(user))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Forgot password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.forgotPassword = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    const data = matchedData(req)
    await findUser(data.email)
    const item = await saveForgotPassword(req)
    emailer.sendResetPasswordEmailMessage(locale, item)
    res.status(200).json(forgotPasswordResponse(item))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Reset password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.resetPassword = async (req, res) => {
  try {
    const data = matchedData(req)
    const forgotPassword = await findForgotPassword(data.id)
    const user = await findUserToResetPassword(forgotPassword.email)
    await updatePassword(data.password, user)
    const result = await markResetPasswordAsUsed(req, forgotPassword)
    res.status(200).json(result)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Refresh token function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getRefreshToken = async (req, res) => {
  try {
    const tokenEncrypted = req.headers.authorization
      .replace('Bearer ', '')
      .trim()
    let userId = await getUserIdFromToken(tokenEncrypted)
    userId = await utils.isIDGood(userId)
    const user = await findUserById(userId)
    const token = await saveUserAccessAndReturnToken(req, user)
    // Removes user info from response
    delete token.user
    res.status(200).json(token)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Roles authorization function called by route
 * @param {Array} roles - roles specified on the route
 */
exports.roleAuthorization = (roles) => async (req, res, next) => {
  try {
    const data = {
      id: req.user._id,
      roles
    }
    await checkPermissions(data, next)
  } catch (error) {
    utils.handleError(res, error)
  }
}


exports.freeExpired = async (req, res) => {
    try {
      // Gets locale from header 'Accept-Language'
      const locale = req.getLocale();
      req = matchedData(req);
      let query = `UPDATE users SET free_expired = 0 WHERE users.id = ${req.user_id}`;
      await utils.executeQuery(query);
      console.log(" req ", req);
      res.status(200).json(successData);
  
    } catch (error) {
      utils.handleError(res, error)
    }
}
