const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserWithdrawalAccountSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['crypto', 'bank'],
        required: true
    },
    label: {
        type: String,
        required: true
    },
    // Crypto fields
    network: {
        type: String  // e.g. TRC20, ERC20, BTC, ETH
    },
    address: {
        type: String
    },
    // Bank fields
    bankName: {
        type: String
    },
    accountName: {
        type: String
    },
    accountNumber: {
        type: String
    },
    routingNumber: {
        type: String
    },
    swiftCode: {
        type: String
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('UserWithdrawalAccount', UserWithdrawalAccountSchema);
