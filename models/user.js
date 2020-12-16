const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: false},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minLength: 6},
    asthmaType: {type: String, required: true},
    medication: [],
    exercises: [{type: mongoose.Types.ObjectId, ref: 'possibleExercises', required: false}],
    triggers: [],
    attacks: [{type: String, required: false}],
    lungDoc: {type: Object, required: false},
    gp: {type: Object, required: false},
    contact: {type: Object, required: false}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
