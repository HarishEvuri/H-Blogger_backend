import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword)
    return res
      .status(202)
      .json({ message: "Please Enter all required fields!" });

  if (password.length < 6)
    return res
      .status(203)
      .json({ message: "Please Set a password of atleast 6 characters!" });

  if (password !== confirmPassword)
    return res
      .status(203)
      .json({ message: "Please Enter the same password twice!" });

  const existingUser = await User.findOne({ email: email });

  if (existingUser)
    return res.status(203).json({
      message: "An account with this email already exists!",
    });

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = new User({
    firstName,
    lastName,
    email,
    passwordHash,
  });

  const savedUser = await newUser.save();

  const token = jwt.sign({ user: savedUser._id }, process.env.JWT_SECRET);

  res
    .status(201)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 604800000,
    })
    .json({
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      id: savedUser._id,
      image: savedUser.image,
    });
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(203)
      .json({ message: "Please Enter all required fields!" });

  const existingUser = await User.findOne({ email });

  if (!existingUser)
    return res.status(203).json({ message: "Invalid email or password!" });

  const passwordCorrect = await bcrypt.compare(
    password,
    existingUser.passwordHash
  );

  if (!passwordCorrect)
    return res.status(203).json({ message: "Invalid email or password!" });

  const token = jwt.sign({ user: existingUser._id }, process.env.JWT_SECRET);

  res
    .status(201)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 604800000,
    })
    .json({
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      email: existingUser.email,
      id: existingUser._id,
      image: existingUser.image,
    });
};

export const signout = async (req, res) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
};

export const updateUser = async (req, res) => {
  const id = req.userId;

  const existingUser = await User.findById(id);
  existingUser.firstName = req.body.firstName;
  existingUser.lastName = req.body.lastName;
  existingUser.image = req.body.image;

  await existingUser.save();

  res.status(201).json({
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
    email: existingUser.email,
    id: existingUser._id,
    image: existingUser.image,
  });
};

export const getUserInfo = async (req, res) => {
  const id = req.userId;

  const existingUser = await User.findById(id);

  res.status(201).json({
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
    email: existingUser.email,
    id: existingUser._id,
    image: existingUser.image,
  });
};
