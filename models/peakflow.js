const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const peakflowSchema = new Schema({
    timestamp: {type: String, required: true},
    afterMedication: {type: Boolean, required: true},
    value: {type: Number, min: 0, max: 1000, required: true},
    user: {type: mongoose.Types.ObjectId, required: true, ref: 'User'}
});

peakflowSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Peakflow', peakflowSchema);