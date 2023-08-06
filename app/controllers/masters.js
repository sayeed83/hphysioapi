const model = require('../models/city')
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const db = require('../middleware/db')
let successData = {message: 'Success', totalRecord: 0, data: [], status: 200}

/*********************
 * Private functions *
 *********************/


/********************
 * Public functions *
 ********************/
exports.getAllItems = async (req, res) => {
  try {
    let data = {};
    const preferencesQuery = `select id,name from services WHERE status = 1`;
    let tempPreferences = await utils.executeQuery(preferencesQuery);
    for (let index = 0; index < tempPreferences.length; index++) {
        // const element = tempPreferences[index];
        tempPreferences[index].checked = false;
        tempPreferences[index].value = '';
        
    }
    data.preferences = tempPreferences;

    const citiesQuery = `SELECT cityID as value, cityName label FROM cities WHERE countryID = 'IND' AND stateID = 187`;
    let tempCities = await utils.executeQuery(citiesQuery);
    data.cities = tempCities;

    const stateOfPracticeQuery = `SELECT stateID as value, stateName label  FROM states WHERE countryID = 'IND'`;
    let tempStateOfPractice = await utils.executeQuery(stateOfPracticeQuery);
    data.stateOfPractice = tempStateOfPractice;

    const specializationQuery = `SELECT id as value, displayName label  FROM master_specialization WHERE deletedAt IS NULL`;
    let tempSpecialization = await utils.executeQuery(specializationQuery);
    data.specialization = tempSpecialization;

    const degreesQuery = `SELECT id, displayName FROM master_degrees WHERE deletedAt IS NULL`;
    let tempDegrees = await utils.executeQuery(degreesQuery);
    data.degrees = tempDegrees;

    const areaQuery = `SELECT id,city_id,name FROM area WHERE deletedAt IS NULL`;
    let tempAreas = await utils.executeQuery(areaQuery);
    data.areas = tempAreas;
    
    successData.data = data;
    successData.totalRecord = data.length;
    res.status(200).json(successData);
  } catch (error) {
    utils.handleError(res, error)
  }
}
