import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateThumbnail } from "../utils/ffmpeg.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../");

const toPublicPath = (absolutePath) => `/${path.relative(projectRoot, absolutePath).replace(/\\/g, "/")}`;

export const uploadVideo = asyncHandler(async (req, res) => {
  if (!req.files?.video?.[0]) {
    throw new ApiError(400, "video file is required");
  }

  const { title, description = "" } = req.body;
  if (!title) throw new ApiError(400, "title is required");

  const videoTempPath = req.files.video[0].path;
  const videoFileName = `${Date.now()}-${req.files.video[0].originalname.replace(/\s+/g, "-")}`;
  const videoDestPath = path.resolve(projectRoot, "uploads/videos", videoFileName);
  fs.renameSync(videoTempPath, videoDestPath);

  let thumbnailDestPath = "";
  if (req.files.thumbnail?.[0]) {
    const thumbnailName = `${Date.now()}-${req.files.thumbnail[0].originalname.replace(/\s+/g, "-")}`;
    thumbnailDestPath = path.resolve(projectRoot, "uploads/thumbnails", thumbnailName);
    fs.renameSync(req.files.thumbnail[0].path, thumbnailDestPath);
  } else {
    const thumbnailName = `${path.parse(videoFileName).name}.jpg`;
    const generatedPath = path.resolve(projectRoot, "uploads/thumbnails", thumbnailName);
    const generated = await generateThumbnail(videoDestPath, generatedPath);
    thumbnailDestPath = generated ? generatedPath : "";
  }

  const video = await Video.create({
    title,
    description,
    videoPath: toPublicPath(videoDestPath),
    thumbnailPath: thumbnailDestPath ? toPublicPath(thumbnailDestPath) : "",
    owner: req.user._id
  });

  const populated = await Video.findById(video._id).populate("owner", "username fullName");
  res.status(201).json(new ApiResponse(201, populated, "Video uploaded"));
});

export const listVideos = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 12), 50);
  const q = req.query.q?.trim();
  const owner = req.query.owner;

  const query = {};
  if (q) {
    query.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } }
    ];
  }
  if (owner) {
    query.owner = owner;
  }

  const [videos, total] = await Promise.all([
    Video.find(query)
      .populate("owner", "username fullName")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Video.countDocuments(query)
  ]);

  res.status(200).json(new ApiResponse(200, { items: videos, page, limit, total }, "Videos fetched"));
});

export const getVideoById = asyncHandler(async (req, res) => {
  const video = await Video.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("owner", "username fullName");

  if (!video) throw new ApiError(404, "Video not found");

  res.status(200).json(new ApiResponse(200, video, "Video fetched"));
});

export const streamVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) throw new ApiError(404, "Video not found");

  const absoluteVideoPath = path.resolve(projectRoot, video.videoPath.slice(1));
  if (!fs.existsSync(absoluteVideoPath)) throw new ApiError(404, "Video file missing");

  const stat = fs.statSync(absoluteVideoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const [startText, endText] = range.replace(/bytes=/, "").split("-");
    const start = parseInt(startText, 10);
    const end = endText ? parseInt(endText, 10) : fileSize - 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": "video/mp4"
    });

    fs.createReadStream(absoluteVideoPath, { start, end }).pipe(res);
    return;
  }

  res.writeHead(200, {
    "Content-Length": fileSize,
    "Content-Type": "video/mp4"
  });
  fs.createReadStream(absoluteVideoPath).pipe(res);
});

export const listComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ video: req.params.id })
    .populate("owner", "username fullName")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, comments, "Comments fetched"));
});

export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) throw new ApiError(400, "Comment text is required");

  const video = await Video.findById(req.params.id);
  if (!video) throw new ApiError(404, "Video not found");

  const comment = await Comment.create({ video: req.params.id, owner: req.user._id, text: text.trim() });
  const populated = await Comment.findById(comment._id).populate("owner", "username fullName");

  res.status(201).json(new ApiResponse(201, populated, "Comment added"));
});
