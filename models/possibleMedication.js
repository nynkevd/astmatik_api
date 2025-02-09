const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const possibleMedicationSchema = new Schema({
    name: {type: String, required: true},
});

possibleMedicationSchema.plugin(uniqueValidator);

module.exports = mongoose.model('possibleMedications', possibleMedicationSchema);