# VideoTube Fullstack

Node.js + Express + MongoDB backend with JWT auth and local uploads, plus a React (Vite + Tailwind) frontend.

## Backend API (default: `http://localhost:8000`)

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### User
- `GET /api/v1/users/profile` (JWT)
- `PATCH /api/v1/users/profile` (JWT)

### Videos
- `POST /api/v1/videos/upload` (JWT, multipart: `video`, optional `thumbnail`)
- `GET /api/v1/videos` (supports `q`, `page`, `limit`, `owner`)
- `GET /api/v1/videos/:id`
- `GET /api/v1/videos/:id/stream`
- `GET /api/v1/videos/:id/comments`
- `POST /api/v1/videos/:id/comments` (JWT)

## Local setup

### 1) Backend
```bash
npm install
cp .env.example .env
npm run dev
```

### 2) Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173` and proxies API/media requests to backend.

## Notes
- Videos are stored in `uploads/videos/`
- Thumbnails are stored in `uploads/thumbnails/`
- If `ffmpeg` is installed, thumbnail auto-generation is attempted when thumbnail is not uploaded.
