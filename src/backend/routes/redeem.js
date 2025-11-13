const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Redemption = require('../models/Redemption');
const User = require('../models/User');

// Simple voucher code generator (for example only)
function createVoucherCode() {
  return 'BOOSTLY-' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

// @route   POST api/redeem
// @desc    Redeem received credits for a voucher
router.post('/', auth, async (req, res) => {
  const { amountToRedeem } = req.body;
  const userId = req.user.id;

  if (!amountToRedeem || amountToRedeem <= 0) {
    return res.status(400).json({ msg: 'Amount must be a positive number.' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);

    // Check Business Rule
    if (user.receivedBalance < amountToRedeem) {
      throw new Error('Insufficient received balance.');
    }

    // Perform Operations
    const voucherValue = amountToRedeem * 5; // ₹5 per credit
    const voucherCode = createVoucherCode();

    // a. Deduct from user's balance
    user.receivedBalance -= amountToRedeem;
    await user.save({ session });

    // b. Create Redemption Log
    const redemption = new Redemption({
      user: userId,
      creditsRedeemed: amountToRedeem,
      voucherValue,
      voucherCode,
    });
    await redemption.save({ session });

    // Commit Transaction
    await session.commitTransaction();
    res.status(201).json(redemption);

  } catch (error) {
    // Abort Transaction on Error
    await session.abortTransaction();
    console.error(error.message);
    res.status(400).json({ msg: error.message || 'Redemption failed.' });
  } finally {
    session.endSession();
  }
});

module.exports = router;