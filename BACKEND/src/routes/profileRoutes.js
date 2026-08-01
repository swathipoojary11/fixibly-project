const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const {
    getProfile,
    updateProfile
} = require("../controllers/profileController");

// View Profile
router.get("/", authenticateUser, getProfile);

// Update Profile
router.put("/", authenticateUser, updateProfile);

module.exports = router;