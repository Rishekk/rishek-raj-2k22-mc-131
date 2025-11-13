const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/leaderboard
// @desc    Get top recipients
router.get('/', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const leaderboard = await User.aggregate([
      // 1. Sort by most received (desc), then ID (asc) for tie-breaking
      { $sort: { receivedBalance: -1, _id: 1 } },

      // 2. Apply the limit
      { $limit: limit },

      // 3. Join with the 'recognitions' collection to get related docs
      {
        $lookup: {
          from: 'recognitions',
          localField: '_id',
          foreignField: 'recipient',
          as: 'recognitionsReceived',
        },
      },

      // 4. Shape the final output
      {
        $project: {
          _id: 1,
          name: 1,
          totalCreditsReceived: '$receivedBalance',

          // Count the number of recognitions they received
          recognitionCount: { $size: '$recognitionsReceived' },

          // Sum the size of each recognition's endorsement array
          totalEndorsements: {
            $sum: { $size: '$recognitionsReceived.endorsements' },
          },
        },
      },
    ]);

    res.json(leaderboard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;