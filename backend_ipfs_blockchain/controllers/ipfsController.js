const fs = require("fs");
const uploadToPinata = require("../services/pinataService");
const prisma = require("../config/prisma");
const generateSHA512 = require("../utils/hashGenerator");
const connectFabric = require("../blockchain/fabricConnection");

const uploadFile = async (req, res) => {
    

    try {

        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        const {
            studentName,
            certificateName,
            issuerName
        } = req.body;

        // Generate SHA-512 hash
        const sha512Hash = generateSHA512(req.file.path);

        // Check duplicate
        const existingCertificate = await prisma.document.findFirst({
            where: {
                sha512Hash
            }
        });

        if (existingCertificate) {

            fs.unlinkSync(req.file.path);

            return res.status(400).json({
                message: "Certificate already exists."
            });
        }

        // Upload to Pinata
        const result = await uploadToPinata(
            req.file.path,
            req.file.originalname
        );

        // Connect to Fabric
        const contract = await connectFabric();

        // Generate blockchain certificate ID
        const certificateId = `CERT${Date.now()}`;

        console.log("Submitting transaction to blockchain...");

        await contract.submitTransaction(
            "CreateCertificate",
            certificateId,
            studentName,
            req.user.id.toString(),
            certificateName,
            issuerName,
            sha512Hash,
            result.IpfsHash
        );

        console.log("Certificate stored on blockchain.");

        // Save in PostgreSQL
        const certificate = await prisma.document.create({
            data: {
                title: certificateName,
                certificateType: certificateName,
                description: null,
                fileName: req.file.filename,
                fileHash: sha512Hash,
                issuedBy: issuerName,
                issueDate: new Date(),
                ipfsHash: result.IpfsHash,
                sha512Hash,
                userId: req.user.id,

                // Save blockchain ID (requires Prisma field)
                blockchainTxId: certificateId
            }
        });

        fs.unlinkSync(req.file.path);

        

        return res.status(200).json({
            message: "Certificate uploaded successfully",
            blockchainCertificateId: certificateId,
            certificate
        });

    } catch (error) {

        console.error(error);

        

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
            message: "Upload failed",
            error: error.message
        });
    }
};

module.exports = {
    uploadFile
};