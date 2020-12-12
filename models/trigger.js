const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const triggerSchema = new Schema({
    name: {type: String, required: true},
});

triggerSchema.plugin(uniqueValidator);

module.exports = mongoose.model('triggers', triggerSchema);