const express = require('express');
const {check} = require('express-validator');

const userController = require('../controllers/user-controller');

const router = express.Router();

router.get("/info", [], userController.getUserInfo);

router.post("/signup", [
    check('firstname').not().isEmpty(),
    check('lastname'),
    check('email').isEmail(),
    check('password').isLength({min: 6}),
    check('asthmaType').not().isEmpty(),
    check('triggers').isArray(),
    check('medication').isArray(),
], userController.signup);

router.post("/login", [
    check('email').isEmail(),
    check('password').not().isEmpty(),
], userController.login);

router.patch("/edit", [
    check('email').isEmail(),
    check('password'),
    check('firstname').not().isEmpty(),
    check('lastname'),
    check('asthmaType').not().isEmpty(),
    check('triggers').isArray(),
    check('medication').isArray(),
], userController.editUser);

module.exports = router;