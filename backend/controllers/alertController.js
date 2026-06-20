const Alert = require('../models/Alert');

const getAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.findAll();
    res.json(alerts);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAlerts,
};
