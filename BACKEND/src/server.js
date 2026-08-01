// // npm install cors
// const cors = require("cors");
// const express = require("express");

// const app = express();

// app.use(cors()); // Allow frontend requests
// app.use(express.json());

// // Routes
// app.use("/api/customer", require("./routes/customerRoutes"));
// const authMiddleware = require('./src/middleware/authMiddleware');

import app from "./app.js"; // Relative path to your app file

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
