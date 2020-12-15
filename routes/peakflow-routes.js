const express = require('express');
const {check} = require('express-validator');

const peakflowController = require('../controllers/peakflow-controller');

const router = express.Router();

router.get("/overview", [], peakflowController.getOverview);

router.post("/add", [
    check('beforeMedication').not().isEmpty(),
    check('afterMedication'),
    check('notes'),
], peakflowController.add);

module.exports = router; 