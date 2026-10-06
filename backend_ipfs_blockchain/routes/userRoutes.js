const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile,
    changePassword
} = require("../controllers/userController");

const authenticateUser =
    require("../middleware/authMiddleware");


// ============================================================
// Register User
// ============================================================

router.post(
    "/register",
    registerUser
);


// ============================================================
// Login User
// ============================================================

router.post(
    "/login",
    loginUser
);


// ============================================================
// Get Logged-in User Profile
// ============================================================

router.get(
    "/profile",
    authenticateUser,
    getProfile
);


// ============================================================
// Change Password
// ============================================================

router.put(
    "/change-password",
    authenticateUser,
    changePassword
);


module.exports = router;