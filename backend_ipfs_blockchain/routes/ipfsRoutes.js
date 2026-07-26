const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authenticateUser = require("../middleware/authMiddleware");

const { uploadFile } = require("../controllers/ipfsController");

router.post(
    "/upload",
    authenticateUser,
    upload.single("file"),
    uploadFile
);

module.exports = router;