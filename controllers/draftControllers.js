import Draft from "../models/draftModel.js";

export const getDrafts = async (req, res) => {
  try {
    const drafts = await Draft.find({ creatorId: req.userId }).select([
      "-body",
    ]);

    res.status(200).json(drafts);
  } catch (error) {
    res.status(203).json({ message: error.message });
  }
};

export const getDraft = async (req, res) => {
  const { id } = req.params;

  const draft = await Draft.findById(id);
  if (!draft)
    return res.status(203).json({ message: `No draft with the id : ${id}` });

  if (draft.creatorId !== req.creatorId)
    return res
      .status(203)
      .json({ message: "You have no access to this draft !" });

  return res.status(201).json(draft);
};

export const createdraft = async (req, res) => {
  const draft = req.body;

  if (!draft.title)
    return res.status(203).json({ message: "Title is required !" });

  const newDraft = new Draft({
    title: draft.title,
    description: draft.description,
    tags: draft.tags,
    body: draft.body,
    thumbnail: draft.thumbnail,
    creatorId: req.userId,
  });

  await newDraft.save();
  res.status(201).json(newDraft);
};

export const updateDraft = async (req, res) => {
  const { id } = req.params;

  const draft = await Draft.findById(id);
  if (!draft)
    return res.status(203).json({ message: `No draft with the id : ${id}` });

  if (draft.creatorId !== req.userId)
    return res
      .status(203)
      .json({ message: "You have no access to this draft !" });

  if (!req.body.title)
    return res.status(203).json({ message: "Title is required !" });

  draft.title = req.body.title;
  draft.description = req.body.description;
  draft.tags = req.body.tags;
  draft.thumbnail = req.body.thumbnail;
  draft.body = req.body.body;

  await draft.save();
  return res.status(201).json(draft);
};

export const deleteDraft = async (req, res) => {
  const { id } = req.params;

  const draft = await Draft.findById(id);
  if (!draft)
    return res.status(203).json({ message: `No draft with the id : ${id}` });

  if (draft.creatorId !== req.userId)
    return res
      .status(203)
      .json({ message: "You have no access to this draft !" });

  await draft.delete();
  res.send();
};
