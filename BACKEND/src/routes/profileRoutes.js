import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const router = express.Router();

router.get("/", authenticateUser, getProfile);
router.put("/", authenticateUser, updateProfile);

export default router;