import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import technicianRoutes from "./routes/technicianRoutes.js";
import dispatcherRoutes from "./routes/dispatcherRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes configuration
app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/technician", technicianRoutes);
app.use("/api/dispatcher", dispatcherRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "FieldFlow Backend API Server Running"
    });
});

export default app;
