import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    videoPath: { type: String, required: true },
    thumbnailPath: { type: String, default: "" },
    views: { type: Number, default: 0 },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

videoSchema.index({ title: "text", description: "text" });

export const Video = mongoose.model("Video", videoSchema);
