import express from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

import {
  signin,
  signup,
  signout,
  updateUser,
  getUserInfo,
} from "../controllers/userControllers.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/signout", signout);
router.post("/update", auth, updateUser);
router.get("/info", auth, getUserInfo);

export default router;
