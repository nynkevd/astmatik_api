const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const attackSchema = new Schema({
    // type: {type: String, required: true}, // RED, ORANGE, YELLOW, GREEN
    timestamp: {type: Date, required: true},
    duration: {type: String, required: true},
    trigger: {type: String, required: true},
    takenMedication: {type: Boolean, required: true},
    medicationTaken: {type: String, required: false},
    medicationHelped: {type: Boolean, required: false},
    user: {type: mongoose.Types.ObjectId, required: true, ref: 'User'}
});

attackSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Attack', attackSchema);
