const {validationResult} = require('express-validator');

const Trigger = require('../models/trigger');

const getTriggers = async (req, res) => {
    let allTriggers = [];
    try {
        allTriggers = await Trigger.find();
    } catch (error) {
        res.status(500).send({message: 'Er is iets fout gegaan, probeer het opnieuw.'});
    }

    return res.status(200).json(allTriggers);
};

const add = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).send({message: 'Vul alle velden in svp.'});
    };

    const {newTrigger} = req.body;

    // Check string or array
    if (typeof newTrigger === "object") {
        for (const trigger of newTrigger) {
            const thisTrigger = new Trigger({
                name: trigger
            });
            try {
                await thisTrigger.save();
            } catch (error) {
                
            }
        }
    } else if (typeof newTrigger === 'string') {
        const thisTrigger = new Trigger({
            name: newTrigger
        });
        try {
            await thisTrigger.save();
        } catch (error) {
            
        }
    }

    return res.status(201).json({message: 'Trigger(s) toegevoegd.'});
}

exports.getTriggers = getTriggers;
exports.add = add;