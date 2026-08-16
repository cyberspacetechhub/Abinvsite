const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceRequestSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // e.g. "Tax Clearance", "Account Verification"
    account: { type: String, enum: ['trading', 'mining', 'general'], default: 'general' },
    message: { type: String }, // admin note shown to user
    isActive: { type: Boolean, default: false },
    requiresPayment: { type: Boolean, default: false },
    amountRequired: { type: Number, default: 0 },
    depositMethod: { type: Schema.Types.ObjectId, ref: 'DepositMethod' },
    status: { type: String, enum: ['pending_payment', 'paid', 'resolved'], default: 'pending_payment' }
}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);
