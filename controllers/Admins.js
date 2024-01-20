import { usersModel } from "../models/Users.js";
import bcrypt from "bcrypt";
import { sanitizeUser } from "../utils/services.js";

export const login = async (req, res) => {
  // you will reach this only if ur sucessfully logged in else not
  if (req.user?.role === "admin") {
    res.status(200).json({
      success: true,
      message: `Welcome , ${req.user.username}`,
      user: sanitizeUser(req.user),
    });
  } else {
    res.status(404).json({
      success: false,
      message: `User not found`,
    });
  }
};

export const loginFailed = (req, res) => {
  return res.status(500).json({
    success: false,
    message: "Invalid Credentials",
  });
};

export const signup = async (req, res, done) => {
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
    role: "admin",
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
