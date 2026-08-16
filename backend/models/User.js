const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const options = {
  discriminatorKey: 'type'
}
const UserSchema = new Schema({
 firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  unhashedPswd: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profile: {
    type: String
  },
  searchString: {
    type: String
  },
  refreshToken: {
    type: String,
  }
},{timestamps: true, ...options});

const User = mongoose.model('User', UserSchema);

module.exports = User;