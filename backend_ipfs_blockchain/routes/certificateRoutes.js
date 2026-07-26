const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
    getAllCertificates,
    getCertificateById,
    getCertificateDownloadLink,
    verifyCertificate,
    verifyCertificateByFile
} = require("../controllers/certificateController");

// Get all certificates
router.get("/", getAllCertificates);

// Verify certificate by ID
router.get("/:certificateId/verify", verifyCertificate);

// Download certificate
router.get("/:certificateId/download", getCertificateDownloadLink);

// Get certificate details
router.get("/:certificateId", getCertificateById);

// Verify uploaded PDF
router.post(
    "/verify-file",
    upload.single("file"),
    verifyCertificateByFile
);

module.exports = router;