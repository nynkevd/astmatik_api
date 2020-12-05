const express = require('express');
const {check} = require('express-validator');

const peakflowController = require('../controllers/peakflow-controller');

const router = express.Router();

router.get("/overview/:userId", [], peakflowController.getOverview);

router.post("/add", [
    check('timestamp').not().isEmpty(),
    check('userId').not().isEmpty(),
    check('value').not().isEmpty(),
    check('afterMedication').isBoolean(),
    check('morning').isBoolean(),
], peakflowController.add);

module.exports = router;