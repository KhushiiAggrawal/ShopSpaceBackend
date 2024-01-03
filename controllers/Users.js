import { usersModel } from "../models/Users.js";
import bcrypt from "bcrypt";
import { sanitizeUser } from "../utils/services.js";

export const getAllRegisteredUsers = async (req, res) => {
  const users = await usersModel.find({});
  if (!users) {
    return res
      .status(500)
      .json({ success: false, message: "failed to fetch users" });
  }
  res.status(200).json({
    success: true,
    users,
  });
};

export const login = async (req, res) => {
    console.log(req)
  res.status(200).json({
    success: true,
    message: `Welcome , ${req.user.username}`,
    user: sanitizeUser(req.user),
  });
};

export const signup = async (req, res) => {
  const { username, mobileNo, email, password } = req.body;
  let user = await usersModel.findOne({ email }); // checking if user already exists or not
  if (user) {
    return res.status(500).json({
      success: false,
      message: "User already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  user = await usersModel.create({
    username,
    mobileNo,
    email,
    password: hashedPassword,
  });
  //Send Registration successfull mail here
  res.status(200).json({
    success: true,
    message: `Acccount Created | ${username}`,
    user: sanitizeUser(user),
  });
};

export const getUser = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

export const logout = (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ success: true, message: "Logged out" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};
