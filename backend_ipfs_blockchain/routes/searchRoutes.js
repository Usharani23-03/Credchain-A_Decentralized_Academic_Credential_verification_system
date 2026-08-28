const express = require("express");

const router =
    express.Router();


const authenticateUser =
    require("../middleware/authMiddleware");


const {
    globalSearch
} =
    require(
        "../controllers/searchController"
    );


// ============================================================
// Global Search
// ============================================================

router.get(

    "/",

    authenticateUser,

    globalSearch

);


module.exports =
    router;