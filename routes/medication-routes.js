const express = require('express');
const {check} = require('express-validator');

const medicationController = require('../controllers/peakflow-controller');

const router = express.Router();

router.get("/overview", [], medicationController.getOverview);

router.post("/add", [
    check('typeMedication'), /* medicatie selection dropdown */
    check('amountPuffsMed'), /* aantal pufs medicatie */ 
    check('timestamp'), /* tijdstip medicatie dropdown */
    check('complaints'), /* klachten radio buttons */
], medicationController.add);

module.exports = router; 