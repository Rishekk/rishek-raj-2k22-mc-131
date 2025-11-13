const mongoose = require('mongoose');

const RedemptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  creditsRedeemed: {
    type: Number,
    required: true,
  },
  voucherValue: {
    type: Number, // credits * 5
    required: true,
  },
  voucherCode: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Redemption', RedemptionSchema);