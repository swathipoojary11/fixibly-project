
import { Application, Request, Response } from "express";
const express = require("express");
const cors = require("cors");
require("dotenv").config();
import { authenticateUser, AuthRequest } from "./middleware/authMiddleware";
import authorizeRoles from "./middleware/roleMiddleware";

// Route Imports (Default imports from your migrated router files)
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import adminRoutes from "./routes/adminRoutes";
import dispatcherRoutes from "./routes/dispatcherRoutes";
import technicianRoutes from "./routes/technicianRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import customerRoutes from "./routes/customerRoutes";

// 1. Initialize Express Application with explicit type
const app: Application = express();

// 2. Global Middleware
app.use(cors());
app.use(express.json());

// 3. Root Health Check Route
app.get("/", (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: "Fixibly FieldFlow Backend Running Successfully 🚀"
  });
});

// 4. Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dispatcher", dispatcherRoutes);
app.use("/api/technician", technicianRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/customer", customerRoutes);

// 5. Protected Test Route (Uses AuthRequest so TS knows req.user exists)
app.get("/api/protected", authenticateUser, (req: AuthRequest, res: Response) => {
  return res.json({
    success: true,
    message: "You have accessed a protected route.",
    user: req.user
  });
});

// 6. Server Initialization
const PORT: number = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 7. Export application instance
export default app;