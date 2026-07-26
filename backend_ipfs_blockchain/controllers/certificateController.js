const prisma = require("../config/prisma");
const crypto = require("crypto");
const fs = require("fs");

// Get all certificates
const getAllCertificates = async (req, res) => {
    try {

        const certificates = await prisma.document.findMany({
            orderBy: {
                uploadedAt: "desc"
            }
        });

        res.status(200).json(certificates);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to fetch certificates"
        });

    }
};

// Get certificate by ID
const getCertificateById = async (req, res) => {

    try {

        const id = Number(req.params.certificateId);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid certificate ID"
            });
        }

        const certificate = await prisma.document.findUnique({
            where: {
                id
            }
        });

        if (!certificate) {
            return res.status(404).json({
                message: "Certificate not found"
            });
        }

        res.status(200).json(certificate);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to fetch certificate"
        });

    }

};

// Get certificate download URL
const getCertificateDownloadLink = async (req, res) => {

    try {

        const id = Number(req.params.certificateId);

        const certificate = await prisma.document.findUnique({
            where: {
                id
            }
        });

        if (!certificate) {
            return res.status(404).json({
                message: "Certificate not found"
            });
        }

        if (!certificate.ipfsHash) {
            return res.status(404).json({
                message: "IPFS file not available"
            });
        }

        res.status(200).json({
            id: certificate.id,
            title: certificate.title,
            issuedBy: certificate.issuedBy,
            downloadUrl: `https://gateway.pinata.cloud/ipfs/${certificate.ipfsHash}`
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to generate download link"
        });

    }

};

// Verify certificate
const verifyCertificate = async (req, res) => {

    try {

        const id = Number(req.params.certificateId);

        const certificate = await prisma.document.findUnique({
            where: {
                id
            }
        });

        if (!certificate) {
            return res.status(404).json({
                verified: false,
                message: "Certificate Not Found"
            });
        }

        res.status(200).json({
            verified: true,
            message: "Certificate Verified Successfully",
            certificate
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            verified: false,
            message: "Verification Failed"
        });

    }

};

// Verify uploaded PDF
const verifyCertificateByFile = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                verified: false,
                message: "Please upload a certificate file"
            });
        }

        const fileBuffer = fs.readFileSync(req.file.path);

        const hash = crypto
            .createHash("sha512")
            .update(fileBuffer)
            .digest("hex");

        const certificate = await prisma.document.findFirst({
            where: {
                sha512Hash: hash
            }
        });

        fs.unlinkSync(req.file.path);

        if (!certificate) {
            return res.status(404).json({
                verified: false,
                message: "Certificate is Fake or Tampered"
            });
        }

        res.status(200).json({
            verified: true,
            message: "Certificate Verified Successfully",
            certificate
        });

    } catch (error) {

        console.log(error);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            verified: false,
            message: "File Verification Failed"
        });

    }

};

module.exports = {
    getAllCertificates,
    getCertificateById,
    getCertificateDownloadLink,
    verifyCertificate,
    verifyCertificateByFile
};