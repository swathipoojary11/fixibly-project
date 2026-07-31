const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authenticateUser = require("./middleware/authMiddleware");
const authorizeRoles = require("./middleware/roleMiddleware");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.json({
        message: "FieldFlow Backend Running Successfully 🚀"
    });
});

// Authentication Routes
app.use("/api/auth", authRoutes);

// Profile Routes
app.use("/api/profile", profileRoutes);

// Protected Route
app.get("/api/protected", authenticateUser, (req, res) => {
    res.json({
        success: true,
        message: "You have accessed a protected route.",
        user: req.user
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});