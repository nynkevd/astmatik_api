const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const possibleTriggerSchema = new Schema({
    triggerName: {type: String, required: true},
});

possibleTriggerSchema.plugin(uniqueValidator);

module.exports = mongoose.model('possibleTriggers', possibleTriggerSchema);