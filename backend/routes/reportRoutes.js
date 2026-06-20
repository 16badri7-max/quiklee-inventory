const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/reportController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/summary', getSummary);

module.exports = router;
