import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/jwt.js";

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (!fullName || !email || !username || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] });
  if (existing) throw new ApiError(409, "Email or username already exists");

  const avatar = req.file ? `/${req.file.path.replace(/\\/g, "/")}` : "";
  const user = await User.create({
    fullName,
    email,
    username,
    password,
    avatar
  });

  const token = signToken(user);
  const safeUser = await User.findById(user._id).select("-password");
  res.status(201).json(new ApiResponse(201, { user: safeUser, token }, "User registered"));
});

export const login = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if ((!email && !username) || !password) {
    throw new ApiError(400, "Email/username and password are required");
  }

  const user = await User.findOne({
    $or: [
      email ? { email: email.toLowerCase() } : null,
      username ? { username: username.toLowerCase() } : null
    ].filter(Boolean)
  });

  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = signToken(user);
  const safeUser = await User.findById(user._id).select("-password");

  res.status(200).json(new ApiResponse(200, { user: safeUser, token }, "Login successful"));
});
