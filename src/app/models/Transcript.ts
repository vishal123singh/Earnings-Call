// models/Transcript.ts
import mongoose from "mongoose";

const TranscriptSchema = new mongoose.Schema(
  {
    ticker: String,
    year: Number,
    quarter: String,

    data: Object, // full transcript JSON

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Prevent model overwrite in dev
export default mongoose.models.Transcript ||
  mongoose.model("Transcript", TranscriptSchema);
