const cron = require('node-cron');
const User = require('./models/User');

const resetMonthlyCredits = async () => {
  console.log('Running monthly credit reset job...');
  try {
    const users = await User.find({});

    for (const user of users) {
      // Business Rule: Carry forward up to 50
      const unusedCredits = user.sendingBalance;
      const carryOver = Math.min(unusedCredits, 50);

      // Business Rule: Reset to 100 + carry-over
      const newSendingBalance = 100 + carryOver;

      // Business Rule: Reset monthly *limit* tracker
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            sendingBalance: newSendingBalance,
            monthlySent: 0,
          },
        }
      );
    }
    console.log('Credit reset job complete for all users.');
  } catch (error) {
    console.error('Error during credit reset job:', error.message);
  }
};

const initializeCronJobs = () => {
  // Schedule to run at 00:00 (midnight) on the 1st day of every month
  cron.schedule('0 0 1 * *', resetMonthlyCredits, {
    timezone: 'Etc/UTC', // Use a standard timezone
  });
  console.log('Cron job for monthly reset scheduled.');
};

module.exports = initializeCronJobs;