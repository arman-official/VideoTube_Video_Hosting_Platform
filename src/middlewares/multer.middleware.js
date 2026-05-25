import multer from "multer";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/temp"),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`)
});

export const upload = multer({ storage });
