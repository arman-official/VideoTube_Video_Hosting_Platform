import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/profile", verifyJWT, getProfile);
router.patch("/profile", verifyJWT, updateProfile);

export default router;
