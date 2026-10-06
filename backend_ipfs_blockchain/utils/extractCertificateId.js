const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const jsQR = require("jsqr");
const { PDFParse } = require("pdf-parse");

/**
 * Extract Certificate ID from a QR code URL.
 *
 * Expected QR content:
 * http://localhost:3000/verify/CERT-XXXXXXXX
 *
 * Also works with:
 * http://10.217.117.117:3000/verify/CERT-XXXXXXXX
 */
const extractCertificateIdFromQR = async (filePath) => {
    try {
        const { data, info } = await sharp(filePath)
            .ensureAlpha()
            .raw()
            .toBuffer({
                resolveWithObject: true
            });

        const qrCode = jsQR(
            new Uint8ClampedArray(data),
            info.width,
            info.height
        );

        if (!qrCode || !qrCode.data) {
            console.log("QR code not found in image");
            return null;
        }

        console.log("QR code detected:", qrCode.data);

        const qrData = qrCode.data.trim();

        // Extract CERT-XXXXXXXX from the QR URL
        const match = qrData.match(
            /(?:\/verify\/|^)(CERT-[A-Za-z0-9-]+)/i
        );

        if (!match) {
            console.log(
                "Certificate ID not found inside QR code"
            );
            return null;
        }

        const certificateId = match[1].trim();

        console.log(
            "Certificate ID extracted from QR:",
            certificateId
        );

        return certificateId;

    } catch (error) {
        console.error(
            "QR CODE EXTRACTION ERROR:",
            error.message
        );

        return null;
    }
};


/**
 * Extract Certificate ID from a PDF.
 *
 * PDF certificates contain:
 * Certificate ID: CERT-XXXXXXXX
 */
const extractCertificateIdFromPDF = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);

        const parser = new PDFParse({
            data: dataBuffer
        });

        const result = await parser.getText();

        await parser.destroy();

        const match = result.text.match(
            /Certificate\s*ID\s*:\s*(CERT-[A-Za-z0-9-]+)/i
        );

        if (!match) {
            console.log(
                "Certificate ID not found in PDF text"
            );

            return null;
        }

        const certificateId = match[1].trim();

        console.log(
            "Certificate ID extracted from PDF:",
            certificateId
        );

        return certificateId;

    } catch (error) {
        console.error(
            "PDF CERTIFICATE ID EXTRACTION ERROR:",
            error.message
        );

        return null;
    }
};


/**
 * Main Certificate ID extractor.
 *
 * Supports:
 * - PDF
 * - JPG
 * - JPEG
 * - PNG
 */
const extractCertificateId = async (filePath) => {
    try {
        const extension = path
            .extname(filePath)
            .toLowerCase();

        console.log(
            "Extracting Certificate ID from:",
            extension
        );

        // PDF → extract Certificate ID from PDF text
        if (extension === ".pdf") {
            return await extractCertificateIdFromPDF(
                filePath
            );
        }

        // Images → extract Certificate ID from QR code
        if (
            extension === ".jpg" ||
            extension === ".jpeg" ||
            extension === ".png"
        ) {
            return await extractCertificateIdFromQR(
                filePath
            );
        }

        console.log(
            "Unsupported certificate file type:",
            extension
        );

        return null;

    } catch (error) {
        console.error(
            "CERTIFICATE ID EXTRACTION ERROR:",
            error.message
        );

        return null;
    }
};

module.exports = extractCertificateId;