const {validationResult} = require('express-validator');
const moment = require('moment');

const User = require('../models/user');
const Medication = require('../models/medication');
const validateRequest = require('../helper/valid-checker');

const getOverview = async (req, res) => {
    await validateRequest(req, res);

    const {userId} = req.userData;

    console.log(userId);

    let user;
    try {
        user = await User.findById(userId);
    } catch (e) {
        return res.status(404).send({message: 'Er is geen gebruiker gevonden.'});
    }

    if (!user) {
        return res.status(404).send({message: 'Er is geen gebruiker gevonden.'});
    }

    let overview = {today: [], thisWeek: {
        medicationName: [], mg: []
    }, thisMonth: {
        medicationName: [], mg: []
    }};

    let todaysMedication = await Medication.find({user: userId, timestamp: {$gt: moment().startOf('day').format(), $lt: moment().endOf('day').format()}}).sort({timestamp: 'asc'});
    for (const thisMedication of todaysMedication) {
        let peakflowToAdd = {
            medicationName: thisMedication.medicationName,
            mg: thisMedication.mg,
            time: moment(thisMedication.timestamp).format("HH:mm"),
        }
        overview.today.push(medicationToAdd);
    }

    let thisWeeksMedication = await Medication.find({user: userId, timestamp: {$gt: moment().startOf('isoWeek').format(), $lt: moment().endOf('isoWeek').format()}}).sort({timestamp: 'asc'});
    for (const thisMedication of thisWeeksMedication) {
        let day = moment(thisMedication.timestamp).day();
        console.log(day);       
        let medicationName = {
            value: thisMedication.beforeMedication,
            mg: thisMedication.mg
        };
        overview.thisWeek.medicationName[day] = medicationName;
        overview.thisWeek.mg[day] = mg;
    }

    let thisMonthMedication = await Medication.find({user: userId, timestamp: {$gt: moment().startOf('isoWeek').format(), $lt: moment().endOf('isoWeek').format()}}).sort({timestamp: 'asc'});
    for (const thisMedication of thisMonthMedication) {
        let day = moment(thisMedication.timestamp).day();
        console.log(day);       
        let medicationName = {
            value: thisMedication.beforeMedication,
            mg: thisMedication.mg
        };
        overview.thisMonth.medicationName[day] = medicationName;
        overview.thisMonth.mg[day] = mg;
    }

    // console.log(overview);
    // console.log("======================================================")

    overview.thisWeek.medicationName = Array.from(overview.thisWeek.medicationName, item => item || {value: 0});
    overview.thisWeek.mg = Array.from(overview.thisWeek.mg, item => item || {value: 0});
    overview.thisMonth.medicationName = Array.from(overview.thisMonth.medicationName, item => item || {value: 0});
    overview.thisMonth.mg = Array.from(overview.thisMonth.mg, item => item || {value: 0});

    // console.log(overview);
    console.log("sending");
    return res.status(200).json(overview);
}


const add = async (req, res, next) => {
    await validateRequest(req, res);

    const {userId} = req.userData;

    const {timestamp, medicationName, mg} = req.body;

    let user;
    try {
        user = await User.findById(userId);
    } catch (e) {
        return res.status(404).send({message: 'Er is geen gebruiker gevonden.'});
    }

    if (!user) {
        return res.status(404).send({message: 'Er is geen gebruiker gevonden.'});
    }

    let morning = moment(timestamp).format("HH") < 12 ? true : false;
 
    const medication = new Medication({
        timestamp: moment(timestamp).format(),
        morning,
        medicationName,
        mg,
        user: user.id,
    });

    try {
        await Medication.save();
    } catch (e) {
        console.log(e);
        return res.status(500).send({message: 'Kan niet opslaan, probeer het opnieuw.'});
    }

    return res.status(201).json({message: 'Medicatie genoteerd.'});

}

exports.getOverview = getOverview;
exports.add = add;