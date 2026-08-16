const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Transaction = require('./Transaction');

const DepositSchema = Transaction.discriminator('Deposit', new Schema({
    depositMethod: {
        type: Schema.Types.ObjectId,
        ref: 'DepositMethod',
        required: true
    },
    targetAccount: {
        type: String,
        enum: ['funding', 'trading', 'mining'],
        default: 'funding'
    }
}));

module.exports = DepositSchema