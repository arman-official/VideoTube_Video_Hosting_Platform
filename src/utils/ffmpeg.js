import { spawn } from "node:child_process";

export const generateThumbnail = (videoPath, thumbnailPath) =>
  new Promise((resolve) => {
    let ffmpeg;
    try {
      ffmpeg = spawn("ffmpeg", [
        "-y",
        "-i",
        videoPath,
        "-ss",
        "00:00:01",
        "-vframes",
        "1",
        thumbnailPath
      ]);
    } catch (error) {
      console.warn("ffmpeg spawn failed:", error.message);
      resolve(false);
      return;
    }

    ffmpeg.on("error", (error) => {
      console.warn("ffmpeg not available:", error.message);
      resolve(false);
    });
    ffmpeg.on("close", (code) => resolve(code === 0));
  });
