const express = require("express");

const router = express.Router();
console.log("✅ Admin routes loaded");

const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getAdminDashboard,
  getAllUsers,
  getAllCertificates,
  getReports
} = require("../controllers/adminController");

// Admin Dashboard
router.get(
  "/dashboard",
  authenticateUser,
  authorizeRoles("ADMIN"),
  getAdminDashboard
);
router.get(
    "/users",
    authenticateUser,
    authorizeRoles("ADMIN"),
    getAllUsers
);
router.get(
    "/certificates",
    authenticateUser,
    authorizeRoles("ADMIN"),
    getAllCertificates
);

router.get(
  "/reports",
  authenticateUser,
  authorizeRoles("ADMIN"),
  getReports
);
module.exports = router;