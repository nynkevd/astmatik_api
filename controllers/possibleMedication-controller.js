const {validationResult} = require('express-validator');

const possibleMedications = require('../models/possibleMedication');

const getMedications = async (req, res) => {
    let allMedications= [];
    try {
        allMedications = await possibleMedications.find();
    } catch (error) {
        res.status(500).send({message: 'Er is iets fout gegaan, probeer het opnieuw.'});
    }

    return res.status(200).json(allMedications);
};

const add = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).send({message: 'Vul alle velden in svp.'});
    };

    const {newMedication} = req.body;

    // Check string or array
    if (typeof newMedication === "object") {
        for (const medication of newMedication) {
            const thisMedication = new possibleMedications({
                name: medication
            });
            try {
                await thisMedication.save();
            } catch (error) {
                
            }
        }
    } else if (typeof newMedication === 'string') {
        const thisMedication = new possibleMedications({
            name: newMedication
        });
        try {
            await thisMedication.save();
        } catch (error) {
            
        }
    }

    return res.status(201).json({message: 'Medicijn(en) toegevoegd.'});
}

exports.getMedications = getMedications;
exports.add = add;