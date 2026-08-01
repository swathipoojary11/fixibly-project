const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { authenticateUser } = require("./middleware/authMiddleware");
const authorizeRoles = require("./middleware/roleMiddleware");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const adminRoutes = require("./routes/adminRoutes");
const dispatcherRoutes = require("./routes/dispatcherRoutes");
const technicianRoutes = require("./routes/technicianRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Root test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Fixibly FieldFlow Backend Running Successfully 🚀"
    });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dispatcher", dispatcherRoutes);
app.use("/api/technician", technicianRoutes);
app.use("/api/notifications", notificationRoutes);

// Protected Test Route
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

module.exports = app;