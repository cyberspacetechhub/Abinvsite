
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Transaction = require('./Transaction');

const WithdrawalSchema = Transaction.discriminator('Withdrawal', new Schema({
    withdrawalAccount: {
        type: Schema.Types.ObjectId,
        ref: 'UserWithdrawalAccount'
    },
    address: {
        type: String
    },
    note: {
        type: String
    }
}));

module.exports = WithdrawalSchema