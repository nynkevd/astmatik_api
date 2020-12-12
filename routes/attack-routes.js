const express = require('express');
const {check} = require('express-validator');

const attackController = require('../controllers/attack-controller');

const router = express.Router();

router.post("/add", [
    check('timestamp').not().isEmpty(),
    check('duration').not().isEmpty(),
    check('trigger').not().isEmpty(),
    check('userId').not().isEmpty(),
    check('medicationTaken'),
    check('takenMedication').isBoolean(),
    check('medicationHelped')
], attackController.add);

module.exports = router;