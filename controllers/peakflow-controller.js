const {validationResult} = require('express-validator');
const moment = require('moment');

const User = require('../models/user');
const Peakflow = require('../models/peakflow');
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
        beforeMedication: {morning: [], evening: []}, afterMedication: {morning: [], evening: []}
    }, thisMonth: {
        beforeMedication: {morning: [], evening: []}, afterMedication: {morning: [], evening: []}
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
    overview.thisWeek.beforeMedication.morning[6] = 0;
    overview.thisWeek.beforeMedication.evening[6] = 0;
    overview.thisWeek.afterMedication.morning[6] = 0;
    overview.thisWeek.afterMedication.evening[6] = 0;

    for (const thisPeakflow of thisWeeksPeakflow) {
        console.log(thisPeakflow);
        let day = moment(thisPeakflow.timestamp).day();
        day -= 1;
        day == -1 && (day = 6);

        console.log(day);  
        if (thisPeakflow.morning) {
            overview.thisWeek.beforeMedication.morning[day] = thisPeakflow.beforeMedication;
            overview.thisWeek.afterMedication.morning[day] = thisPeakflow.afterMedication;
        } else {
            overview.thisWeek.beforeMedication.evening[day] = thisPeakflow.beforeMedication;
            overview.thisWeek.afterMedication.evening[day] = thisPeakflow.afterMedication;  
        }     
    }
    

    let thisMonthsPeakflow = await Peakflow.find({user: userId, timestamp: {$gt: moment().startOf('month').format(), $lt: moment().endOf('month').format()}}).sort({timestamp: 'asc'});
    overview.thisMonth.beforeMedication.morning[moment().endOf("month").format("DD")] = 0;
    overview.thisMonth.beforeMedication.evening[moment().endOf("month").format("DD")] = 0;
    overview.thisMonth.afterMedication.morning[moment().endOf("month").format("DD")] = 0;
    overview.thisMonth.afterMedication.evening[moment().endOf("month").format("DD")] = 0;
    
    for (const thisPeakflow of thisMonthsPeakflow) {
        let day = moment(thisPeakflow.timestamp).date();
        day -= 1; 

        if (thisPeakflow.morning) {
            overview.thisMonth.beforeMedication.morning[day] = thisPeakflow.beforeMedication;
            overview.thisMonth.afterMedication.morning[day] = thisPeakflow.afterMedication;
        } else {
            overview.thisMonth.beforeMedication.evening[day] = thisPeakflow.beforeMedication;
            overview.thisMonth.afterMedication.evening[day] = thisPeakflow.afterMedication;  
        }     
    }

    // console.log(overview);
    // console.log("======================================================");

    overview.thisWeek.beforeMedication.morning = Array.from(overview.thisWeek.beforeMedication.morning, item => item || 0);
    overview.thisWeek.beforeMedication.evening = Array.from(overview.thisWeek.beforeMedication.evening, item => item || 0);
    overview.thisWeek.afterMedication.morning = Array.from(overview.thisWeek.afterMedication.morning, item => item || 0);
    overview.thisWeek.afterMedication.evening = Array.from(overview.thisWeek.afterMedication.evening, item => item || 0);
    
    overview.thisMonth.beforeMedication.morning = Array.from(overview.thisMonth.beforeMedication.morning, item => item || 0);
    overview.thisMonth.beforeMedication.evening = Array.from(overview.thisMonth.beforeMedication.evening, item => item || 0);
    overview.thisMonth.afterMedication.morning = Array.from(overview.thisMonth.afterMedication.morning, item => item || 0);
    overview.thisMonth.afterMedication.evening = Array.from(overview.thisMonth.afterMedication.evening, item => item || 0);

    console.log(overview);
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