const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KYCSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
    unique: true
  },
  documentType: {
    type: String,
    required: true,
    enum: ['passport', 'national_id', 'drivers_license']
  },
  documentNumber: {
    type: String,
    required: true
  },
  documentImage: {
    type: String,
    required: true
  },
  selfieImage: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, { timestamps: true });

module.exports = mongoose.model('KYC', KYCSchema);