const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    uploadDocument,
    getMyDocuments,
    getDocumentById,
    deleteDocument,
    downloadDocument,
    verifyDocument
} = require("../controllers/documentController");


// Upload Certificate (Blockchain + IPFS)
// Allowed for STUDENT, UNIVERSITY, ADMIN during testing
router.post(
    "/upload",
    authenticateUser,
    authorizeRoles("STUDENT", "UNIVERSITY", "ADMIN"),
    upload.single("certificate"),
    uploadDocument
);

// Verify Certificate
router.post(
    "/verify",
    upload.single("certificate"),
    verifyDocument
);

// Get documents uploaded by logged-in user
router.get(
    "/my-documents",
    authenticateUser,
    getMyDocuments
);


// Get Document By ID
router.get(
    "/:id",
    authenticateUser,
    getDocumentById
);


// Download Document
router.get(
    "/download/:id",
    authenticateUser,
    downloadDocument
);


// Delete Document
router.delete(
    "/:id",
    authenticateUser,
    deleteDocument
);


module.exports = router;