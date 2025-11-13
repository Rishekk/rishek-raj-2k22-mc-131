Boostly — Peer Recognition Platform

Boostly is a full-stack MERN application that enables college students to recognize their peers by sending "kudos" credits. The platform encourages appreciation and engagement across student communities, allowing users to send credits, endorse recognitions, and redeem earned rewards for tangible value.

This project is built with a modern MERN stack, featuring a React frontend, an Express.js/Node.js backend, and a MongoDB database. It includes JWT for authentication, Mongoose for object-data modeling (ODM), and a scheduled cron job for monthly business logic.

🚀 Tech Stack

Category

Technology

Frontend

React.js, React Router, React Context API, Axios

Backend

Node.js, Express.js

Database

MongoDB (with Mongoose)

Authentication

JSON Web Tokens (JWT), bcrypt.js

Utilities

node-cron (for scheduled jobs), cors, dotenv

✨ Features

User Authentication: Secure user registration and login using JWT.

Peer Recognition:

Allows one student to recognize another and send a specific number of credits with a message.

Each student receives 100 credits every month.

Students cannot send credits to themselves.

A monthly sending limit of 100 credits is enforced.

Endorsements:

Enables students to "Endorse" (like) an existing recognition post.

Each student can only endorse a specific recognition once.

Redemption:

Lets students redeem the credits they've received.

Credits are converted into vouchers at ₹5 per credit.

Redeemed credits are permanently deducted from the student's received balance.

Monthly Credit Reset (Step-Up Challenge):

An automated cron job runs on the 1st of every month.

Resets each student's sending balance to 100.

Allows a carry-forward of up to 50 unused credits from the previous month.

Leaderboard (Step-Up Challenge):

A dynamic leaderboard ranking top recipients.

Ranks by total credits received (descending).

Includes total recognition count and total endorsement count for each ranked user.

🏁 Getting Started

To get this project running locally, you'll need to set up both the backend server and the frontend client.

Prerequisites

Node.js (v16 or later)

npm or yarn

A MongoDB Atlas account (for the free cluster)

1. Backend Setup (boostly-backend)

First, set up the Express server.

Clone the repository:

git clone [https://github.com/your-username/boostly-project.git](https://github.com/your-username/boostly-project.git)
cd boostly-project/boostly-backend


Install dependencies:

npm install


Create your Environment File:
Create a file named .env in the boostly-backend root directory and add the following variables.

# Get this from your MongoDB Atlas dashboard (see "How to get URL" guide)
MONGO_URI=mongodb+srv://<username>:<password>@your-cluster.mongodb.net/boostlyDB?retryWrites=true&w=majority

# Create a long, random string for your JWT secret
JWT_SECRET=your_jwt_secret_key_goes_here

# Port to run the server on
PORT=5000


Run the backend server:

# Runs the server with nodemon for live reloading
npm run dev 


Your backend API will now be running at http://localhost:5000.

2. Frontend Setup (boostly-client)

Next, set up the React client in a new terminal window.

Navigate to the client directory:

# From the project root
cd boostly-client


Install dependencies:

npm install


Update the API URL:
For this project, the API URL is set directly in src/api/api.js. Make sure it matches your backend server.

// src/api/api.js
const API_BASE_URL = 'http://localhost:5000/api'; 


Run the frontend client:

npm start


Your React application will open in your browser at http://localhost:3000.

You can now register a new user, log in, and use the application!

📝 API Endpoints

All protected routes require a Bearer <token> in the Authorization header.

Method

Endpoint

Protection

Description

POST

/api/auth/register

Public

Register a new user.

POST

/api/auth/login

Public

Log in a user and receive a JWT.

GET

/api/auth/me

Private

Get the logged-in user's data.

GET

/api/auth/users

Private

Get a list of all users (for the dropdown).









POST

/api/recognitions

Private

Send kudos (credits) to another user.

GET

/api/recognitions

Private

Get the main feed of all recognitions.

POST

/api/recognitions/:id/endorse

Private

Endorse a specific recognition.









POST

/api/redeem

Private

Redeem received credits for a voucher.









GET

/api/leaderboard

Private

Get the top user leaderboard.
