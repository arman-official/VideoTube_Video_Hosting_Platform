import { Router } from "express";
import {
  addComment,
  getVideoById,
  listComments,
  listVideos,
  streamVideo,
  uploadVideo
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post(
  "/upload",
  verifyJWT,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),
  uploadVideo
);

router.get("/", listVideos);
router.get("/:id", getVideoById);
router.get("/:id/stream", streamVideo);
router.get("/:id/comments", listComments);
router.post("/:id/comments", verifyJWT, addComment);

export default router;
