const express = require('express');
const {check} = require('express-validator');

const userController = require('../controllers/user-controller');

const router = express.Router();

router.post("/createuser", [
    check('name').not().isEmpty(),
], userController.createUser);

module.exports = router;