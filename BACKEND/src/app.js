import express from "express";
import cors from "cors";

// Corrected relative paths and converted all requirements to imports
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js"; // Note the 's' on the end
import profileRoutes from "./routes/profileRoutes.js";
import technicianRoutes from "./routes/technicianRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes configuration
app.use("/api/technician", technicianRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Fixibly Technician Backend Running"
    });
});

export default app;
