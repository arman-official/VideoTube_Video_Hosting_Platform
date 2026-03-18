# 🎥 VideoTube Backend | Chai aur Code Series

A production-ready, feature-rich backend for a video hosting platform (YouTube clone) built by me. [Arman Gupta]

This project focuses on building a robust API using industry-standard practices, including secure authentication, media management with Cloudinary, and complex database aggregation using Mongoose.

## 🛠️ Tech Stack
- **Runtime:** [Node.js](https://nodejs.org)
- **Framework:** [Express.js](https://expressjs.com)
- **Database:** [MongoDB](https://www.mongodb.com) (Atlas) with [Mongoose](https://mongoosejs.com)
- **Authentication:** JSON Web Tokens (JWT) with Access & Refresh Token logic
- **File Handling:** [Multer](https://github.com) (Local storage) and [Cloudinary](https://cloudinary.com) (Cloud storage)
- **Security:** [bcrypt](https://github.com) for password hashing and CORS for cross-origin requests

## ✨ Key Features
- **User Management:** Secure signup, login, logout, password change, and profile updates (avatar/cover image).
- **Video Control:** Uploading, publishing/unpublishing, searching, sorting, and pagination.
- **Social Interactions:** Like/dislike videos, comments, and tweets.
- **Subscription System:** Follow channels and track subscriber/subscribed counts.
- **Playlists:** Create, update, and manage collections of videos.
- **Dashboard:** Real-time statistics for content creators (total views, subscribers, likes).

## 📂 Project Structure
```text
src/
├── controllers/    # Request handling logic (User, Video, Like, etc.)
├── db/             # Database connection setup
├── middlewares/    # Authentication (JWT) and file upload (Multer) handling
├── models/         # Mongoose schemas (User, Video, Subscription, etc.)
├── routes/         # API endpoint definitions
├── utils/          # Helper classes (ApiError, ApiResponse, asyncHandler)
└── app.js          # Express app configuration
```

⚙️ Installation & Setup
Clone the repository:

```
git clone https://github.com
cd 
```

Configure Environment Variables:
Create a .env file in the root directory and add the following:

```
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your_secret_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_secret_key
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the application:

```
# For development (with nodemon)
npm run dev

# For production
npm start
```
# VideoTube_Backend
