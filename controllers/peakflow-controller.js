const {validationResult} = require('express-validator');
const moment = require('moment');

const User = require('../models/user');
const Peakflow = require('../models/peakflow');

const getOverview = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).send({message: 'Vul alle velden in svp.'});
    }

    const {userId} = req.params;

    let user;
    try {
        user = await User.findById(userId);
    } catch (e) {
        return res.status(404).send({message: 'Er is geen gebruiker gevonden.'});
    }

    if (!user) {
        return res.status(404).send({message: 'Er is geen gebruiker gevonden.'});
    }

    let overview = {today: [], thisWeek: {}, thisMonth: {}};
    // "Mon": [], "Tue": [], "Wed": [], "Thu": [], "Fri": [], "Sat": [], "Sun": []
    
    // Today, This week, This months?
    let todaysPeakflow = await Peakflow.find({user: userId, timestamp: {$gt: moment().startOf('day').format(), $lt: moment().endOf('day').format()}}).sort({timestamp: 'asc'});
    for (const thisPeakflow of todaysPeakflow) {
        console.log(thisPeakflow);
        overview.today.push({
            time: moment(thisPeakflow.timestamp).format("HH:mm"),
            value: thisPeakflow.value,
            morning: thisPeakflow.morning
        });
    }

    let thisWeeksPeakflow = await Peakflow.find({user: userId, timestamp: {$gt: moment().startOf('isoWeek').format(), $lt: moment().endOf('isoWeek').format()}}).sort({timestamp: 'asc'});
    for (const thisPeakflow of thisWeeksPeakflow) {
        let day = moment(thisPeakflow.timestamp).format("ddd");
        if (!overview.thisWeek[day]) {
            overview.thisWeek[day] = [];
        }
        overview.thisWeek[day].push({
            value: thisPeakflow.value,
            morning: thisPeakflow.morning
        });
    }

    let thisMonthsPeakflow = await Peakflow.find({user: userId, timestamp: {$gt: moment().startOf('month').format(), $lt: moment().endOf('month').format()}}).sort({timestamp: 'asc'});
    for (const thisPeakflow of thisMonthsPeakflow) {
        let day = moment(thisPeakflow.timestamp).format("DD");
        if (!overview.thisMonth[day]) {
            overview.thisMonth[day] = [];
        }
        overview.thisMonth[day].push({
            value: thisPeakflow.value,
            morning: thisPeakflow.morning
        });
    }

    return res.status(200).json(overview);
}


const add = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).send({message: 'Vul alle velden in svp.'});
    }

    const {timestamp, morning, afterMedication, value, userId} = req.body;

    let user;
    try {
        console.log("test");
        user = await User.findById(userId);
    } catch (e) {
        return res.status(404).send({message: 'Er is geen gebruiker gevonden.'});
    }

    if (!user) {
        return res.status(404).send({message: 'Er is geen gebruiker gevonden.'});
    }

    const peakflow = new Peakflow({
        timestamp: moment().format(), // TODO: Change to actual timestamp instead of placeholder!
        morning,
        afterMedication,
        user: user.id,
        value
    });

    try {
        await peakflow.save();
    } catch (e) {
        console.log(e);
        return res.status(500).send({message: 'Kan niet opslaan, probeer het opnieuw.'});
    }

    return res.status(201).json({message: 'Peakflow genoteerd.'});

}

exports.getOverview = getOverview;
exports.add = add;