const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const documentRoutes = require("./routes/documentRoutes");
console.log("Document routes loaded:", documentRoutes);
const verificationRoutes = require("./routes/verificationRoutes");
const ipfsRoutes = require("./routes/ipfsRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const app = express();

const PORT = process.env.PORT || 5555;

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/", (req, res) => {
    res.send("Backend is working!");
});

// Routes
app.use("/users", userRoutes);
app.use("/documents", documentRoutes);
app.use("/verify", verificationRoutes);
app.use("/ipfs", ipfsRoutes);
app.use("/certificates", certificateRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/admin", adminRoutes);
console.log("✅ Admin routes registered");
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        message: "Internal server error"
    });
});

// Start server
if (require.main === module) {

    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    console.log("Server object created:", !!server);

    server.on("close", () => {
        console.log("Server closed!");
    });

    process.on("exit", (code) => {
        console.log("Process exited with code:", code);
    });
}
console.log("User routes loaded:", userRoutes);
module.exports = app;