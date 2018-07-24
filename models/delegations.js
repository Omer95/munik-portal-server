const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const delegateSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    committee: {
        type: String,
        required: true
    }
});

const delegationSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    school: {
        type: String,
        required: true
    },
    delegates: [delegateSchema]
}, {
    timestamps: true
});



let Delegations = mongoose.model('Delegation', delegationSchema);
let Delegates = mongoose.model('Delegate', delegateSchema);
module.exports = Delegations;