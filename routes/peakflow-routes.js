const express = require('express');
const {check} = require('express-validator');

const peakflowController = require('../controllers/peakflow-controller');

const router = express.Router();

router.get("/overview", [], peakflowController.getOverview);

router.post("/add", [
    check('beforeMedication').not().isEmpty(),
    check('afterMedication'),
    check('notes'),
    check('morning').isBoolean()
], peakflowController.add);

router.patch("/edit", [
    check('id').not().isEmpty(),
    check('beforeMedication').not().isEmpty(),
    check('afterMedication'),
    check('notes'),
    check('morning').isBoolean()
], peakflowController.edit);

module.exports = router; 