# Recruiter Application

A full-stack application for managing the recruitment process, including job postings, candidate applications, and video interviews.

## Project Structure

### Frontend Structure
```
recruiter-app-frontend/
├── public/
│   ├── index.html
│   └── assets/
│       ├── images/
│       └── favicon.ico
└── src/
    ├── assets/
    │   ├── images/
    │   └── styles/
    │       └── main.css
    ├── components/
    │   ├── common/            // Reusable components (Button, Modal, etc.)
    │   ├── layouts/           // Layout components (Header, Footer, Sidebar)
    │   ├── recruiter/         // Recruiter-specific components (JobList, CandidateCard, etc.)
    │   └── interview/         // Interview process components:
    │         ├── InterviewCard.js       // Display individual interview details
    │         ├── InterviewList.js       // List of scheduled interviews
    │         └── VideoCall.js           // Video call interface (using WebRTC or embedded third-party)
    ├── pages/
    │   ├── Dashboard.js       // Recruiter dashboard with interview overview
    │   ├── Login.js           // Login page
    │   ├── Signup.js          // Signup/Registration page
    │   ├── JobPosting.js      // Form to post a new job
    │   ├── JobList.js         // Listing of jobs
    │   ├── CandidateList.js   // Listing of candidates/applications
    │   ├── Profile.js         // User profile page for viewing/editing details and CV upload
    │   └── InterviewSchedule.js   // Page to schedule and manage interviews
    ├── services/
    │   ├── api.js             // Axios or Fetch API calls configuration
    │   └── videoService.js    // Helper service for video call integration (generating links/tokens)
    ├── App.js                 // Main app component
    ├── index.js               // React DOM rendering
    └── routes.js              // Route definitions for React Router
```

### Backend Structure
```
recruiter-app-backend/
├── src/
│   ├── config/
│   │   ├── db.config.js       // MySQL connection configuration
│   │   └── config.js          // Other configuration variables (JWT secret, video API keys, email credentials, etc.)
│   ├── controllers/
│   │   ├── authController.js          // Authentication logic
│   │   ├── candidateController.js     // CRUD operations for candidate data
│   │   ├── jobController.js           // CRUD operations for job postings
│   │   └── interviewController.js     // Manage interview scheduling, status updates, video call link generation, and email notifications
│   ├── middlewares/
│   │   ├── authMiddleware.js          // JWT validation and role checking
│   │   └── errorHandler.js            // Centralized error handling
│   ├── models/
│   │   ├── User.js            // User model for recruiters & candidates
│   │   ├── Job.js             // Job posting model
│   │   ├── Candidate.js       // Candidate profile/model
│   │   ├── Application.js     // Job application model
│   │   └── Interview.js       // Interview model (includes interview date, status, video meeting link, etc.)
│   ├── routes/
│   │   ├── authRoutes.js            // Routes for login, signup, etc.
│   │   ├── candidateRoutes.js       // Routes for candidate operations
│   │   ├── jobRoutes.js             // Routes for job management
│   │   └── interviewRoutes.js       // Routes for interview scheduling, status updates, and video call management
│   ├── services/
│   │   ├── emailService.js          // Email service to send notifications (interview details, meeting link, etc.)
│   │   └── videoHelper.js           // Functions to interact with a video call API or generate WebRTC tokens/links
│   ├── utils/
│   │   └── helper.js                // Utility functions (e.g., formatting dates)
│   └── server.js                    // Entry point for the Node/Express server
├── package.json                     // Node package file
└── .env                             // Environment variables (DB credentials, JWT secret, video API keys, email credentials, etc.)
```

## Configuration

### Environment Variables

Create a `.env` file in your project root with the following sample values (update these with your own credentials):

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=recruiter_app
DB_DIALECT=mysql

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=86400

EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your_ethereal_user
EMAIL_PASS=your_ethereal_password

FRONTEND_URL=http://localhost:3000

VIDEO_API_BASE_URL=https://meet.jit.si
```

### Database Configuration

The `src/config/db.config.js` file sets up the Sequelize connection:

```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql'
  }
);

module.exports = sequelize;
```

### Application Configuration

The `src/config/config.js` file contains configuration for JWT, email, and video settings:

```javascript
module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '86400', // in seconds
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  videoApiBaseUrl: process.env.VIDEO_API_BASE_URL || 'https://meet.jit.si',
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};
```

## User Roles & Authentication

### User Roles

#### Recruiter Role

**Responsibilities:**
- Post and manage job listings
- Review candidate applications
- Schedule and manage interviews
- Monitor interview progress and update stages
- Initiate video calls for interviews

**Features:**
- Recruiter dashboard (overview of jobs, candidates, and interviews)
- Job posting and editing
- Candidate profile viewing and management
- Interview scheduling and status tracking
- Access to video call integration

#### Candidate Role

**Responsibilities:**
- Browse and apply to job listings
- Manage personal profile and resume
- View application status
- Participate in scheduled interviews

**Features:**
- Candidate dashboard (list of applied jobs, interview schedule, notifications)
- Application submission forms
- Interview scheduling view and notifications
- Option to join video calls for interviews

#### Admin Role (Optional)

**Responsibilities:**
- Oversee overall application data
- Manage both recruiter and candidate accounts
- Audit system logs and user activities

**Features:**
- Admin panel for user and content management
- Reporting and analytics
- Ability to modify or disable accounts
- Review and override interview statuses if necessary

## API Endpoints

#### Login a User

| Detail | Value |
|--------|-------|
| Endpoint | `POST /api/auth/login` |
| Description | Logs in a user and returns a JWT token |
| Request Body | ```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}


### Candidate Endpoints

#### Get Candidate Profile

| Detail | Value |
|--------|-------|
| Endpoint | `GET /api/candidate/profile` |
| Description | Retrieves the candidate profile details |
| Headers Required | `Authorization: Bearer <your_jwt_token>` |

#### Update Candidate Profile

| Detail | Value |
|--------|-------|
| Endpoint | `PUT /api/candidate/profile` |
| Description | Updates the candidate profile |
| Headers Required | `Authorization: Bearer <your_jwt_token>` |
| Request Body | ```json
{
  "resume": "Updated resume text or URL to resume."
}


### Job Endpoints

#### Create a Job Posting

| Detail | Value |
|--------|-------|
| Endpoint | `POST /api/jobs` |
| Description | Creates a new job posting (Requires Recruiter role) |
| Headers Required | `Authorization: Bearer <your_jwt_token>` |
| Request Body | ```json
{
  "title": "Software Developer",
  "description": "Looking for an experienced software developer.",
  "requirements": "Node.js, React, MySQL"
}


#### Get All Job Postings

| Detail | Value |
|--------|-------|
| Endpoint | `GET /api/jobs` |
| Description | Retrieves a list of all job postings |
| Headers Required | `Authorization: Bearer <your_jwt_token>` |

### Interview Endpoints

#### Schedule an Interview

| Detail | Value |
|--------|-------|
| Endpoint | `POST /api/interviews/schedule` |
| Description | Schedules an interview by creating an interview record, generating a video meeting link (using Jitsi), and sending an email notification |
| Headers Required | `Authorization: Bearer <your_jwt_token>` |
| Request Body | ```json
{
  "candidateId": 2,
  "jobId": 1,
  "date": "2025-04-01T10:00:00Z"
}


#### Update Interview Status

| Detail | Value |
|--------|-------|
| Endpoint | `PUT /api/interviews/status` |
| Description | Updates the status of an existing interview (e.g., Scheduled, In Progress, Completed, Cancelled) |
| Headers Required | `Authorization: Bearer <your_jwt_token>` |
| Request Body | ```json
{
  "interviewId": 1,
  "status": "In Progress"
}


## Profile Page Implementation

The Profile page allows users to view and edit their personal details and upload their CV. This has been added to the frontend structure under `src/pages/Profile.js`.

### Features

| Feature | Description |
|---------|-------------|
| User Information | Display personal and professional details |
| Edit Profile | Edit personal details and professional information |
| CV Management | Upload and manage CV/resume files |
| Application History | View history of job applications (for candidates) |
| Job Management | View posted jobs and their stats (for recruiters) |

### Implementation Steps

| Step | Description |
|------|-------------|
| 1 | Create a new page component at `src/pages/Profile.js` |
| 2 | Add the profile route to `routes.js` |
| 3 | Implement API calls for fetching and updating profile data |
| 4 | Add CV upload functionality with file input and form submission |

## Testing with Postman

### Authentication Testing

| Step | Description |
|------|-------------|
| 1 | Create a new POST request |
| 2 | Set the URL to `http://localhost:5000/api/auth/login` |
| 3 | In the Body tab (raw JSON), paste: ```json
{
  "email": "test@example.com",
  "password": "password123"
}


| 4 | Send the request and copy the returned JWT token |

### Testing Protected Endpoints

| Step | Description |
|------|-------------|
| 1 | Create a new request with the appropriate method (GET, POST, PUT, etc.) |
| 2 | Set the URL to the desired endpoint |
| 3 | In the Headers tab, add: Key: `Authorization`, Value: `Bearer <your_jwt_token>` |
| 4 | For POST/PUT requests, add the required JSON body |
| 5 | Send the request |

## Getting Started

### Prerequisites
- Node.js and npm
- MySQL database

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/recruiter-app.git
   cd recruiter-app
   ```

2. Install backend dependencies:
   ```
   cd Backend
   npm install
   ```

3. Create a `.env` file in the backend directory with your configuration

4. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

5. Run the backend server:
   ```
   cd ../backend
   npm run start or npm run dev
   ```

6. Run the frontend development server:
   ```
   cd ../frontend
   npm start
   ```

## License
[MIT License](LICENSE)
