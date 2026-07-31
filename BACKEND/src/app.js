import express from "express";
import cors from "cors";

import technicianRoutes from "./routes/technicianRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/technician", technicianRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Fixibly Technician Backend Running"
    });
});

export default app;