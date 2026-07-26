const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile
} = require("../controllers/userController");

const authenticateUser = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Route
router.get("/profile", authenticateUser, getProfile);

module.exports = router;