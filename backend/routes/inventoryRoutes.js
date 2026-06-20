const express = require('express');
const router = express.Router();
const { getStatus } = require('../controllers/inventoryController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/status', getStatus);

module.exports = router;
