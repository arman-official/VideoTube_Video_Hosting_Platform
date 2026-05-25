import { spawn } from "node:child_process";

export const generateThumbnail = (videoPath, thumbnailPath) =>
  new Promise((resolve) => {
    const ffmpeg = spawn("ffmpeg", [
      "-y",
      "-i",
      videoPath,
      "-ss",
      "00:00:01",
      "-vframes",
      "1",
      thumbnailPath
    ]);

    ffmpeg.on("error", () => resolve(false));
    ffmpeg.on("close", (code) => resolve(code === 0));
  });
