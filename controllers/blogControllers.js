import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";

export const getBlogs = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 10;
    const startIndex = (Number(page) - 1) * LIMIT;

    const total = await Blog.countDocuments({});
    const blogs = await Blog.find()
      .select(["-body", "-likes", "-comments"])
      .sort({ updatedAt: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.json({
      data: blogs,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    res.status(200).json(blog);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getBlogsbyCreator = async (req, res) => {
  const { id } = req.params;
  try {
    const blogs = await Blog.find({ creatorId: id }).select([
      "-body",
      "-likes",
      "-comments",
    ]);

    res.status(200).json(blogs);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createBlog = async (req, res) => {
  const blog = req.body;
  const creator = await User.findById(req.userId);

  if (!blog.title || !blog.description || !blog.tags)
    return res
      .status(400)
      .json({ message: "Please Enter all required fields!" });

  const newBlog = new Blog({
    title: blog.title,
    description: blog.description,
    tags: blog.tags,
    body: blog.body,
    creatorId: creator._id,
    thumbnail: blog.thumbnail,
    creatorName: `${creator.firstName} ${creator.lastName}`,
  });

  await newBlog.save();
  res.status(201).json(newBlog);
};

export const updateBlog = async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);
  if (!blog)
    return res.status(400).json({ message: `No Blog with the id : ${id}` });

  if (blog.creatorId !== req.userId)
    return res
      .status(400)
      .json({ message: `You have no access to this blog!` });

  blog.title = req.body.title;
  blog.description = req.body.description;
  blog.body = req.body.body;
  blog.thumbnail = req.body.thumbnail;
  blog.tags = req.body.tags;
  blog.updatedAt = new Date();

  await blog.save();
  return res.status(200).json(blog);
};

export const deleteBlog = async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);
  if (!blog)
    return res.status(400).json({ message: `No Blog with the id : ${id}` });

  if (blog.creatorId !== req.userId)
    return res
      .status(400)
      .json({ message: `You have no access to this blog!` });

  await blog.delete();
  res.send();
};

export const likeBlog = async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);

  const index = blog.likes.findIndex((id) => id === String(req.userId));
  if (index === -1) {
    blog.likes.push(req.userId);
    blog.likesCount = blog.likesCount + 1;
  } else {
    blog.likes = blog.likes.filter((id) => id !== String(req.userId));
  }

  await blog.save();
  res.status(200).json(blog);
};
