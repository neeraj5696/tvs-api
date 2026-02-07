const express = require('express');
const BioStarController = require('../controllers/biostarController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/biostar/data - Get data by date
// router.post('/data', authenticate, BioStarController.getDataByDate);
router.post('/data',  BioStarController.getDataByDate);

module.exports = router;