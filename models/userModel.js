import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    image: { type: String },
    readingList: { type: Array, default: [] },
    drafts: { type: Array, default: [] },
    createdBlogs: { type: Array, default: [] },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const User = mongoose.model("User", userSchema);

export default User;
