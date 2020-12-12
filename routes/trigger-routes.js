const express = require('express');
const {check} = require('express-validator');

const triggerController = require('../controllers/trigger-controller');

const router = express.Router();

router.get("/get", [], triggerController.getTriggers);

router.post("/add", [
    check('newTrigger').not().isEmpty(),
], triggerController.add);

module.exports = router;