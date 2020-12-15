const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const validateRequest = require('../helper/valid-checker');

const getUserInfo = async (req, res, next) => {
    await validateRequest(req, res, next);

    const {userId} = req.userData;

    let user;
    try {
        user = await User.findById(userId);
    } catch (e) {
        return res.status(404).send({message: 'Er is geen gebruiker gevonden.'});
    }

    if (!user) {
        return res.status(404).send({message: 'Er is geen gebruiker gevonden.'});
    }

    const {firstname, lastname, asthmaType, email, medication, triggers} = user;

    res.send({firstname, lastname, asthmaType, email, medication, triggers});
};

const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).send({message: 'Vul alle velden in svp.'});
    }

    const {firstname, lastname, email, password, asthmaType} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
    } catch (e) {
        return res.status(500).send({message: 'Kan niet aanmelden, probeer het opnieuw.'});
    }

    if (existingUser) {
        return res.status(422).send({message: 'Er bestaat al iemand met dit email-adres'});
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (e) {
        return res.status(500).send({message: 'Kan niet aanmelden, probeer het opnieuw.'});
    }

    const createdUser = new User({
        firstname,
        lastname: lastname || null,
        email,
        password: hashedPassword,
        asthmaType
    });

    try {
        await createdUser.save();
    } catch (e) {
        return res.status(500).send({message: 'Kan niet aanmelden, probeer het opnieuw.'});
    }

    let token;
    try {
        token = jwt.sign(
            {userId: existingUser.id, email: existingUser.email},
            process.env.JWT_KEY);
    } catch (e) {
        return res.status(500).send({message: 'Kan niet inloggen, probeer het opnieuw.'});    
    }

    return res.status(201).json({token});
}

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).send({message: 'Controleer de velden en probeer het opnieuw.'});
    }

    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
    } catch (e) {
        return res.status(500).send({message: 'Kan niet inloggen, probeer het opnieuw.'});
    }

    if (!existingUser) {
        return res.status(500).send({message: 'Kan niet inloggen, probeer het opnieuw.'});
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (e) {
        return res.status(500).send({message: 'Kan niet inloggen, probeer het opnieuw.'});
    }

    if (!isValidPassword) {
        return res.status(403).send({message: 'Wachtwoord klopt niet.'});
    }

    let token;
    try {
        token = jwt.sign(
            {userId: existingUser.id, email: existingUser.email},
            process.env.JWT_KEY);
    } catch (e) {
        return res.status(500).send({message: 'Kan niet inloggen, probeer het opnieuw.'});    
    }

    const {firstname, lastname, asthmaType, medication, triggers} = existingUser;


    res.json({token, firstname, lastname, asthmaType, medication, triggers});

};

const editUser = async (req, res) => {
    await validateRequest(req, res);

    const {userId} = req.userData;
    const {firstname, lastname, email, password, asthmaType} = req.body;

    let user;
    try {
        user = await User.findById(userId);
    } catch (e) {
        return res.status(404).send({message: 'Er is geen gebruiker gevonden. Probeer het opnieuw.'});
    }

    if (!user) {
        return res.status(404).send({message: 'Er is geen gebruiker gevonden.'});
    }

    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
    } catch (e) {
        return res.status(500).send({message: 'Kan niet aanmelden, probeer het opnieuw.'});
    }

    if (!!existingUser && user.id !== existingUser.id) {
        return res.status(422).send({message: 'Er bestaat al iemand met dit email-adres'});
    }

    let hashedPassword;
    if (password) {
        try {
            hashedPassword = await bcrypt.hash(password, 12);
        } catch (e) {
            return res.status(500).send({message: 'Kan niet aanmelden, probeer het opnieuw.'});
        }
    }

    try {
        user.firstname = firstname;
        user.lastname = lastname || null;
        user.email = email;
        user.password = hashedPassword || user.password;
        user.asthmaType = asthmaType;
        await user.save();
    } catch {
        return res.status(500).send({message: 'Er is iets fout gegaan, probeer het opnieuw.'});
    }

    return res.status(200).send({message: 'Succesvol de gebruiker aangepast.'})
}


exports.getUserInfo = getUserInfo;
exports.signup = signup;
exports.login = login;
exports.editUser = editUser;