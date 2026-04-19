import mongoose, { Schema, Document } from "mongoose";

export interface ISentiment extends Document {
  ticker: string;
  year: number;
  quarter: string;

  sentiment_analysis: {
    label: "Positive" | "Neutral" | "Negative";
    confidence: number;

    summary: string;
    key_insights: string[];
    risks: string[];
    opportunities: string[];

    management_tone: string;
    notable_quotes: string[];
  };

  createdAt: Date;
  updatedAt: Date;
}

const SentimentSchema = new Schema<ISentiment>(
  {
    ticker: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },

    year: {
      type: Number,
      required: true,
      index: true,
    },

    quarter: {
      type: String,
      required: true,
      enum: ["Q1", "Q2", "Q3", "Q4"],
      index: true,
    },

    sentiment_analysis: {
      label: {
        type: String,
        enum: ["Positive", "Neutral", "Negative"],
        default: "Neutral",
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5,
      },

      summary: {
        type: String,
        default: "",
      },

      key_insights: {
        type: [String],
        default: [],
      },

      risks: {
        type: [String],
        default: [],
      },

      opportunities: {
        type: [String],
        default: [],
      },

      management_tone: {
        type: String,
        default: "",
      },

      notable_quotes: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  },
);

// ✅ Prevent duplicate entries
SentimentSchema.index({ ticker: 1, year: 1, quarter: 1 }, { unique: true });

export default mongoose.models.Sentiment ||
  mongoose.model<ISentiment>("Sentiment", SentimentSchema);
