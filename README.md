MERN Online Class Platform

This project is a complete MERN stack website for online classes with video upload support.

Tech Stack
- MongoDB
- Express.js
- React (Vite)
- Node.js

Main Features
- Student and Instructor registration/login
- JWT authentication
- Instructor creates course
- Instructor uploads class video files (MP4/WebM/MOV)
- Instructor adds lessons to course using uploaded videos
- Student browses courses and watches lessons

Project Structure
- server: Express API + MongoDB models + video upload endpoints
- client: React frontend

Backend Setup
1. Open terminal in server folder
2. Run: npm install
3. Update server/.env if needed
4. Run: npm run dev

Frontend Setup
1. Open terminal in client folder
2. Run: npm install
3. Run: npm run dev

Default URLs
- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- Uploaded videos served from: http://localhost:5000/uploads/<filename>

Important Notes
- For local development, point MONGO_URI or LOCAL_MONGO_URI to a running MongoDB instance on port 27017.
- If you use MongoDB Atlas, make sure your current IP is allowed in the Atlas network access list.
- In development, if Atlas is unreachable, the server falls back to local MongoDB and then to in-memory MongoDB so it can still start.
- Use the Atlas SRV form for MONGO_URI when you want data to store in your cluster: mongodb+srv://<user>:<password>@cluster0.jyzeql7.mongodb.net/online_classes?retryWrites=true&w=majority
- Set REQUIRE_ATLAS=true if you want startup to fail unless Atlas is connected.
- Video files are stored in server/uploads
- Max upload size set to 500 MB

Key API Endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET /api/courses
- GET /api/courses/mine
- GET /api/courses/:id
- POST /api/courses
- POST /api/courses/:id/lessons
- POST /api/upload/video

Next Improvements (Optional)
- Cloudinary or S3 integration for scalable video hosting
- Payment and enrollment system
- Live classes via WebRTC
- Progress tracking and quiz module
