const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
    verifyByFile,
    verifyByHash,
    verifyByQR
} = require("../controllers/verificationController");

router.post(
    "/file",
    upload.single("certificate"),
    verifyByFile
);

router.post(
    "/hash",
    verifyByHash
);

router.post(
    "/qr",
    verifyByQR
);

module.exports = router;