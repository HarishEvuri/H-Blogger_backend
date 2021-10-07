import express from "express";

import {
  getDrafts,
  getDraft,
  createdraft,
  updateDraft,
  deleteDraft,
} from "../controllers/draftControllers.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getDrafts);
router.get("/:id", auth, getDraft);

router.post("/", auth, createdraft);
router.post("/:id", auth, updateDraft);
router.delete("/:id", auth, deleteDraft);

export default router;
