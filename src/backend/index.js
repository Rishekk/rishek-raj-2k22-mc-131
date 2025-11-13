const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db');
const initializeCronJobs = require('./cron-jobs');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/', (req, res) => res.send('Boostly API Running'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/recognitions', require('./routes/recognitions'));
app.use('/api/redeem', require('./routes/redeem'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

// Start the scheduled credit reset job
initializeCronJobs();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));