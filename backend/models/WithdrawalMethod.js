
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WithdrawalMethod = new Schema({
    name: {
        type: String,
        required: true
    },
    minAmount: {
        type: Number,
    },
    maxAmount: {
        type: Number,
    },
    description: {
        type: String,
    }
});

module.exports = mongoose.model('WithdrawalMethod', WithdrawalMethod);