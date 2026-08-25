const QRCode = require("qrcode");

const generateVerificationQR = async (certificateId) => {
    if (!certificateId) {
        throw new Error("Certificate ID is required");
    }

    const frontendURL =
        process.env.FRONTEND_URL || "http://localhost:3000";

    const verificationURL =
        `${frontendURL}/verify/${encodeURIComponent(certificateId)}`;

    const qrDataURL = await QRCode.toDataURL(verificationURL, {
        errorCorrectionLevel: "H",
        margin: 2,
        width: 500
    });

    return {
        certificateId,
        verificationURL,
        qrDataURL
    };
};

module.exports = generateVerificationQR;