const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const {
    getProfile,
    updateProfile
} = require("../controllers/profileController");



// GET PROFILE
router.get(
    "/",
    authenticateUser,
    getProfile
);


// UPDATE PROFILE
router.put(
    "/",
    authenticateUser,
    updateProfile
);


module.exports = router;