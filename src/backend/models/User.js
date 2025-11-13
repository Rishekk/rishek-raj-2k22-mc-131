const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  // Balance for GIVING credits (resets monthly)
  sendingBalance: {
    type: Number,
    default: 100,
  },
  // Balance for REDEEMING credits (builds up)
  receivedBalance: {
    type: Number,
    default: 0,
  },
  // Tracks spending against the 100-credit sending *limit*
  monthlySent: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);