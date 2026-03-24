import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"; // ❗ MISSING IMPORT

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        const token =
            req.cookies?.accessToken ||
            authHeader?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "No token provided");
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRETS
        );

        const user = await User.findById(decodedToken?._id)
            .select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access token");
        }

        req.user= user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});