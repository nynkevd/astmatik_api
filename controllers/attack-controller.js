const {validationResult} = require('express-validator');
const moment = require('moment');

const Attack = require('../models/attack');
const User = require('../models/user');

const add = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).send({message: 'Vul alle velden in svp.'});
    }

    const {timestamp, duration, trigger, userId, takenMedication, medicationTaken, medicationHelped} = req.body;

    let user;
    try {
        user = await User.findById(userId);
    } catch (e) {
        return res.status(404).send({message: 'Er is geen gebruiker gevonden.'});
    }

    if (!user) {
        return res.status(404).send({message: 'Er is geen gebruiker gevonden.'});
    }

    const attack = new Attack({
        timestamp: moment(timestamp).format(),
        duration,
        trigger,
        user: user.id,
        takenMedication: takenMedication,
        medicationTaken: medicationTaken || null,
        medicationHelped: medicationHelped || null
    });

    try {
        await attack.save();
        await user.attacks.push(attack.id);
        await user.save();
    } catch (e) {
        console.log(e);
        return res.status(500).send({message: 'Kan niet opslaan, probeer het opnieuw.'});
    }

    return res.status(201).json({message: 'Aanval genoteerd.'});

}

exports.add = add;