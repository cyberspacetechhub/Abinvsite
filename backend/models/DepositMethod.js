
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DepositMethodSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['crypto', 'bank'],
        default: 'crypto'
    },
    qrCode: {
        type: String
    },
    minAmount: {
        type: Number
    },
    maxAmount: {
        type: Number
    },
    description: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('DepositMethod', DepositMethodSchema);