const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "..", "uploads");

// Make sure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },

    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/[<>:"/\\|?*]/g, "_");

        cb(
            null,
            `${Date.now()}-${safeName}`
        );
    }
});

const fileFilter = (req, file, cb) => {

    const allowedExtensions = /\.pdf$/i;

    const isPDF = allowedExtensions.test(file.originalname);

    if (isPDF) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed."));
    }
};

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;