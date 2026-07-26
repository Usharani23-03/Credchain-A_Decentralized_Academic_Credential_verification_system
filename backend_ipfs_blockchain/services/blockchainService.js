const connectFabric = require("../fabric/connection");

// ================= Store Certificate =================

exports.storeHashOnBlockchain = async (
    fileHash,
    certificateId = null,
    studentName = "Unknown",
    registerNo = "Unknown",
    degree = "Certificate",
    issuer = "Unknown",
    ipfsCID = ""
) => {

    try {

        const contract = await connectFabric();

        // Generate certificate ID if not provided
        if (!certificateId) {
            certificateId = `CERT-${Date.now()}`;
        }

        await contract.submitTransaction(
            "CreateCertificate",
            certificateId,
            studentName,
            registerNo,
            degree,
            issuer,
            fileHash,
            ipfsCID
        );

        return {
            success: true,
            transactionId: certificateId,
            certificateId,
            hash: fileHash
        };

    } catch (error) {

        console.error("Blockchain Store Error:", error);

        return {
            success: false,
            error: error.message
        };

    }

};

// ================= Verify Certificate =================

exports.verifyHashOnBlockchain = async (
    certificateId,
    fileHash
) => {

    try {

        const contract = await connectFabric();

        const result = await contract.evaluateTransaction(
            "VerifyCertificate",
            certificateId,
            fileHash
        );

        return {
            exists: result.toString() === "true"
        };

    } catch (error) {

        console.error("Blockchain Verify Error:", error);

        return {
            exists: false,
            error: error.message
        };

    }

};