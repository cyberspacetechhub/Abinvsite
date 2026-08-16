const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

const ClientSchema = User.discriminator('Client', new Schema({
 username: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  tradingBalance: {
    type: Number,
    default: 0
  },
  pendingBalance: {
    type: Number,
    default: 0
  },
  profitBalance: {
    type: Number,
    default: 0
  },
  miningBalance: {
    type: Number,
    default: 0
  },
  miningMachines: [{
    machineId: { type: String },
    name: { type: String },
    hashrate: { type: String },
    price: { type: Number },
    status: { type: String, enum: ['idle', 'running', 'stopped'], default: 'idle' },
    startedAt: { type: Date },
    totalMined: { type: Number, default: 0 },
    purchasedAt: { type: Date, default: Date.now }
  }],
  idType: {
    type: String,
  },
  idNumber: {
    type: String,
  },
  idImage: {
    type: String,
  },
  country: {
    type: String,
  },
  address: {
    type: String,
  },
  plan: {
    type: Schema.Types.ObjectId,
    ref: "InvestmentPlan"
  },
  transactions: [{
    type: Schema.Types.ObjectId,
    ref: "Transaction",
  }],
  maintenanceAlert: { type: Boolean, default: false },
  maintenanceAlertMessage: { type: String, default: "" },
  securityAlert: {type: Boolean, default: false},
  securityAlertMessage: { type: String, default: "" },
  planUpgradeAlert: {type: Boolean, default: false},
  planUpgradeAlertMessage: { type: String, default: "" },
  referralCode: { type: String, unique: true }, // Each user gets a unique code
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: "Client", default: null }, // Store the referrer ID
  bonus: { type: Number, default: 0 }, // Reward balance
  kycStatus: {
    type: String,
    enum: ['not_submitted', 'pending', 'approved', 'rejected'],
    default: 'not_submitted'
  },
  kycSubmission: {
    type: Schema.Types.ObjectId,
    ref: 'KYC'
  },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  withdrawalEnabled: { type: Boolean, default: false },
  withdrawalLimit: { type: Number, default: 0 }, // 0 = no limit set by admin
  withdrawalVerificationCode: { type: String },
  withdrawalCodeExpiry: { type: Date },
  unlockRequestImage: { type: String },
  unlockRequestStatus: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
  unlockRequestDate: { type: Date },
  tempLoginCode: { type: String },
  tempLoginCodeExpiry: { type: Date }
}))
module.exports = ClientSchema;