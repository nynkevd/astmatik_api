const express = require('express');
const {check} = require('express-validator');

const possibleMedicationController = require('../controllers/possibleMedication-controller');

const router = express.Router();

router.get("/get", [], possibleMedicationController.getMedications);

router.post("/add", [
    check('newMedication').not().isEmpty(),
], possibleMedicationController.add);

module.exports = router;