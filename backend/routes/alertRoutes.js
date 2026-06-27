const express = require('express');
const router = express.Router();
const { getAlerts, scanAndGenerateAlerts } = require('../controllers/alertController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', getAlerts);
router.post('/scan', scanAndGenerateAlerts);

module.exports = router;
