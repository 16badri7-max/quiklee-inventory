const express = require('express');
const router = express.Router();
const { getAlerts } = require('../controllers/alertController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', getAlerts);

module.exports = router;
