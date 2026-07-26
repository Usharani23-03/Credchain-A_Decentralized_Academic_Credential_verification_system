const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + "-" + file.originalname
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