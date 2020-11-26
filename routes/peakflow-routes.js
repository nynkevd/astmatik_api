const express = require('express');
const {check} = require('express-validator');

const peakflowController = require('../controllers/peakflow-controller');

const router = express.Router();

router.post("/add", [
    check('user').not().isEmpty(),
    check('value').not().isEmpty(),
    check('afterMedication').not().isEmpty(),
    check('')
], peakflowController.add);

module.exports = router;