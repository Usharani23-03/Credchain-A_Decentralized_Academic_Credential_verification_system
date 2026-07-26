const crypto = require("crypto");
const fs = require("fs");

const generateSHA512 = (filePath) => {

    const fileBuffer = fs.readFileSync(filePath);

    return crypto
        .createHash("sha512")
        .update(fileBuffer)
        .digest("hex");
};

module.exports = generateSHA512;