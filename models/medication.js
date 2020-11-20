const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const medicationSchema = new Schema({
    timestamp: {type: String, required: true},
    medicationName: {type: String, required: true},
    mg: {type: Number, required: true},
    user: {type: mongoose.Types.ObjectId, required: true, ref: 'User'}
});

medicationSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Medications', medicationSchema);