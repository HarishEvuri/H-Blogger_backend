import express from "express";
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
} from "../controllers/blogControllers.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getBlog);

router.post("/", auth, createBlog);
router.post("/:id", auth, updateBlog);
router.delete("/:id", auth, deleteBlog);
router.post("/:id/likeBlog", auth, likeBlog);

export default router;
