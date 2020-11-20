const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    timestamp: {type: String, required: true},
    exerciseName: {type: String, required: true},
    frequency: {type: Number, required: true},
    user: {type: mongoose.Types.ObjectId, required: true, ref: 'User'}
});

exerciseSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Exercises', exerciseSchema);