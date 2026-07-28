const express = require("express");

const router = express.Router();

const {
    studentDashboard,
    universityDashboard,
    employerDashboard,
    adminDashboard
} = require("../controllers/dashboardController");


const authenticateUser = require("../middleware/authMiddleware");



router.get(
    "/student",
    authenticateUser,
    studentDashboard
);


router.get(
    "/university",
    authenticateUser,
    universityDashboard
);


router.get(
    "/employer",
    authenticateUser,
    employerDashboard
);


router.get(
    "/admin",
    authenticateUser,
    adminDashboard
);


module.exports = router;