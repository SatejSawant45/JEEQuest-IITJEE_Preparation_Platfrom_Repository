# JeeQuest (IITJEE Preparation Platform)

A quiz and learning platform designed to connect students with mentors and offer interactive quizzes The repository is divided into three main microservices: a React frontend, an Express backend, and a real-time messaging server.

## Features

- **Role-Based Access Control**: Separate portals and dashboards for **Users** (students), **Admins**, and **Mentors**.
- **Interactive Quizzes**: Take quizzes, view detailed post-quiz performance analysis, mathematical rendering (LaTeX), and track history.
- **Real-Time Communication**: Live chat and WebRTC Video Calls between mentors and users utilizing Socket.io.
- **Leaderboards & Progress Tracking**: Gamified learning with global leaderboards and performance charts.
- **Cloud Storage**: AWS S3 integration for storing user/admin avatars, blog images, and resources.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Shadcn UI, Context API
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), AWS S3 (Images), Google Gemini API
- **Messaging/Video Server**: Node.js, Socket.io, WebRTC (Peer-to-Peer)

## Repository Structure

- `/Frontend` - React application (User, Mentor, and Admin interfaces).
- `/Backend` - Main REST API server handling authentication, quizzes, blogs, AI chat, and AWS integrations.
- `/MessagingServer` - Dedicated WebSocket server for real-time chat and video call signaling.

## Environment Variables

You need to create a `.env` file in each of the three directories.

**Backend (`/Backend/.env`)**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=your_bucket_name
GEMINI_API_KEY=your_gemini_key
ADMIN_SECRET_KEY=your_admin_registration_secret
```

**Frontend (`/Frontend/.env`)**
```env
VITE_PRIMARY_BACKEND_URL=http://localhost:5000
VITE_MESSAGING_SERVER_URL=http://localhost:5001
```

**Messaging Server (`/MessagingServer/.env`)**
```env
PORT=5001
```

## Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Quiz_website
   ```

2. **Install dependencies for all services:**
   ```bash
   cd Backend && npm install
   cd ../Frontend && npm install
   cd ../MessagingServer && npm install
   ```

3. **Start the servers:**
   Open three separate terminal windows and run:
   - **Backend**: `cd Backend && npm start` (or `npm run dev`)
   - **Frontend**: `cd Frontend && npm run dev`
   - **Messaging Server**: `cd MessagingServer && npm start` (or `npm run dev`)

## Security

- **Admin Registration**: Creating an admin account requires knowing the `ADMIN_SECRET_KEY` configured in the Backend.
