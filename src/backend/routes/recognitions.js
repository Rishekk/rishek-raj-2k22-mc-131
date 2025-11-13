const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Recognition = require('../models/Recognition');
const User = require('../models/User');

// @route   POST api/recognitions
// @desc    Send recognition (kudos) to another user
router.post('/', auth, async (req, res) => {
  const { recipientId, amount, message } = req.body;
  const senderId = req.user.id;

  // --- 1. Business Rule Validations ---
  if (senderId === recipientId) {
    return res.status(400).json({ msg: 'You cannot send credits to yourself.' });
  }
  if (!amount || amount <= 0) {
    return res.status(400).json({ msg: 'Amount must be a positive number.' });
  }

  // --- 2. Transaction Logic ---
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sender = await User.findById(senderId).session(session);
    const recipient = await User.findById(recipientId).session(session);

    if (!recipient) {
      throw new Error('Recipient not found.');
    }

    // --- 3. Check Business Rules (Core) ---
    if (sender.sendingBalance < amount) {
      throw new Error('Insufficient sending balance.');
    }
    if (sender.monthlySent + amount > 100) {
      throw new Error('Exceeds monthly sending limit of 100 credits.');
    }

    // --- 4. Perform Operations ---
    // a. Update Sender
    sender.sendingBalance -= amount;
    sender.monthlySent += amount;
    await sender.save({ session });

    // b. Update Recipient
    recipient.receivedBalance += amount;
    await recipient.save({ session });

    // c. Create Recognition Log
    const recognition = new Recognition({
      sender: senderId,
      recipient: recipientId,
      amount,
      message,
    });
    await recognition.save({ session });

    // --- 5. Commit Transaction ---
    await session.commitTransaction();
    res.status(201).json(recognition);

  } catch (error) {
    // --- 6. Abort Transaction on Error ---
    await session.abortTransaction();
    console.error(error.message);
    res.status(400).json({ msg: error.message || 'Transaction failed.' });
  } finally {
    session.endSession();
  }
});

// @route   POST api/recognitions/:id/endorse
// @desc    Endorse a recognition entry
router.post('/:id/endorse', auth, async (req, res) => {
  try {
    const recognitionId = req.params.id;
    const userId = req.user.id;

    // Use $addToSet to add the user ID only if it doesn't already exist
    const recognition = await Recognition.findOneAndUpdate(
      { _id: recognitionId },
      { $addToSet: { endorsements: userId } },
      { new: true } // Return the updated document
    );

    if (!recognition) {
      return res.status(404).json({ msg: 'Recognition not found.' });
    }
    
    res.json(recognition);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/recognitions
// @desc    Get all recognitions (for the main feed)
router.get('/', auth, async (req, res) => {
  try {
    const recognitions = await Recognition.find()
      .populate('sender', 'name')
      .populate('recipient', 'name')
      .sort({ createdAt: -1 }); // Show newest first
    res.json(recognitions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;