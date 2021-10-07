import mongoose from "mongoose";

const draftSchema = new mongoose.Schema(
  {
    creatorId: { type: String, required: true },
    title: String,
    description: String,
    body: String,
    tags: [String],
    thumbnail: String,
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const Draft = mongoose.model("Draft", draftSchema);

export default Draft;
