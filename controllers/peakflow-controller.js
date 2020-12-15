const {validationResult} = require('express-validator');
const moment = require('moment');

const User = require('../models/user');
const Peakflow = require('../models/peakflow');

const getOverview = async (req, res) => {
    await validateRequest(req, res);

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

    let overview = {today: [], thisWeek: {
        beforeMedication: [], afterMedication: []
    }, thisMonth: {
        beforeMedication: [], afterMedication: []
    }};

    let todaysPeakflow = await Peakflow.find({user: userId, timestamp: {$gt: moment().startOf('day').format(), $lt: moment().endOf('day').format()}}).sort({timestamp: 'asc'});
    for (const thisPeakflow of todaysPeakflow) {
        let peakflowToAdd = {
            beforeMedication: thisPeakflow.beforeMedication,
            afterMedication: thisPeakflow.afterMedication,
            time: moment(thisPeakflow.timestamp).format("HH:mm"),
            notes: thisPeakflow.notes
        }
        overview.today.push(peakflowToAdd);
    }

    let thisWeeksPeakflow = await Peakflow.find({user: userId, timestamp: {$gt: moment().startOf('isoWeek').format(), $lt: moment().endOf('isoWeek').format()}}).sort({timestamp: 'asc'});
    for (const thisPeakflow of thisWeeksPeakflow) {
        let day = moment(thisPeakflow.timestamp).day();
        console.log(day);       
        let beforeMedPeakflow = {
            value: thisPeakflow.beforeMedication,
            morning: thisPeakflow.morning
        };
        let afterMedPeakflow = {
            value: thisPeakflow.afterMedication,
            morning: thisPeakflow.morning
        };
        overview.thisWeek.beforeMedication[day] = beforeMedPeakflow;
        overview.thisWeek.afterMedication[day] = afterMedPeakflow;
    }

    let thisMonthsPeakflow = await Peakflow.find({user: userId, timestamp: {$gt: moment().startOf('month').format(), $lt: moment().endOf('month').format()}}).sort({timestamp: 'asc'});
    for (const thisPeakflow of thisMonthsPeakflow) {
        let day = moment(thisPeakflow.timestamp).date();      
        let beforeMedPeakflow = {
            value: thisPeakflow.beforeMedication,
            morning: thisPeakflow.morning
        };
        let afterMedPeakflow = {
            value: thisPeakflow.beforeMedication,
            morning: thisPeakflow.morning
        };
        overview.thisMonth.beforeMedication[day] = beforeMedPeakflow;
        overview.thisMonth.afterMedication[day] = afterMedPeakflow;
    }

    // console.log(overview);
    // console.log("======================================================")

    overview.thisWeek.beforeMedication = Array.from(overview.thisWeek.beforeMedication, item => item || {value: 0});
    overview.thisWeek.afterMedication = Array.from(overview.thisWeek.afterMedication, item => item || {value: 0});
    overview.thisMonth.beforeMedication = Array.from(overview.thisMonth.beforeMedication, item => item || {value: 0});
    overview.thisMonth.afterMedication = Array.from(overview.thisMonth.afterMedication, item => item || {value: 0});

    // console.log(overview);
    console.log("sending");
    return res.status(200).json(overview);
}


const add = async (req, res, next) => {
    await validateRequest(req, res);

    const {userId} = req.userData;

    const {timestamp, beforeMedication, afterMedication, notes} = req.body;

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
 
    const peakflow = new Peakflow({
        timestamp: moment(timestamp).format(),
        morning,
        beforeMedication,
        afterMedication,
        notes,
        user: user.id,
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