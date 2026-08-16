

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Transaction = require('./Transaction');

const InvestmentSchema = Transaction.discriminator('Investment', new Schema({

    depositMethod: {
        type: Schema.Types.ObjectId,
        ref: 'DepositMethod'
    },
    investmentPlan: {
        type: Schema.Types.ObjectId,
        ref: 'InvestmentPlan',
        required: true
    },
    source: {
        type: String,
    }
}));

module.exports = InvestmentSchema