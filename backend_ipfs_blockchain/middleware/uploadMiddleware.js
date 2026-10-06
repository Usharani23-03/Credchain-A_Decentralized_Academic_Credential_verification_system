const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "..", "uploads");

// Make sure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Store uploaded files in uploads folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },

    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(
            /[<>:"/\\|?*]/g,
            "_"
        );

        cb(
            null,
            `${Date.now()}-${safeName}`
        );
    }
});

// Allow PDF, JPG, JPEG and PNG
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png"
    ];

    const allowedExtensions = [
        ".pdf",
        ".jpg",
        ".jpeg",
        ".png"
    ];

    const extension = path.extname(file.originalname).toLowerCase();

    const isAllowed =
        allowedMimeTypes.includes(file.mimetype) &&
        allowedExtensions.includes(extension);

    if (isAllowed) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only PDF, JPG, JPEG, and PNG files are allowed."
            )
        );
    }
};

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;