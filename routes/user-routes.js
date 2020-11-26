const express = require('express');
const {check} = require('express-validator');

const userController = require('../controllers/user-controller');

const router = express.Router();

router.post("/signup", [
    check('firstname').not().isEmpty(),
    check('lastname'),
    check('email').isEmail(),
    check('password').isLength({min: 6}),
    check('asthmaType').not().isEmpty(),
], userController.signup);

router.post("/login", [
    check('email').isEmail(),
    check('password').not().isEmpty(),
], userController.login);

module.exports = router;