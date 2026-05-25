import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, "Profile fetched"));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (fullName !== undefined) req.user.fullName = fullName;
  if (email !== undefined) req.user.email = email.toLowerCase();
  if (password !== undefined && password.length > 0) req.user.password = password;

  await req.user.save();
  const safeUser = req.user.toObject();
  delete safeUser.password;

  res.status(200).json(new ApiResponse(200, safeUser, "Profile updated"));
});
