const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const peakflowSchema = new Schema({
    timestamp: {type: Date, required: true},
    morning: {type: Boolean, required: true},
    beforeMedication: {type: Number, min: 0, max: 1000, required: true},
    afterMedication: {type: Number, min: 0, max: 1000},
    notes: {type: String, required: false},
    user: {type: mongoose.Types.ObjectId, required: true, ref: 'User'}
});

peakflowSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Peakflow', peakflowSchema);