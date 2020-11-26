const {validationResult} = require('express-validator');

const Peakflow = require('../models/peakflow');

const add = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).send({message: 'Vul alle velden in svp.'});
    }

}

exports.add = add;