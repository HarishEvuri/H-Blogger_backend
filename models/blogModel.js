import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  creatorId: { type: String, required: true },
  creatorName: { type: String, required: true },
  creatorImage: String,
  title: { type: String, required: true },
  description: String,
  body: String,
  tags: { type: Array, default: [] },
  thumbnail: String,
  likes: { type: [String], default: [] },
  comments: { type: Array, default: [] },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  updatedAt: { type: Date, default: new Date() },
  createdAt: { type: Date, default: new Date() },
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
