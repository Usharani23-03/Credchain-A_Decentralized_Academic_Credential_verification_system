const prisma = require("../config/prisma");
const generateFileHash = require("../utils/hashGenerator");
const { storeHashOnBlockchain } = require("../services/blockchainService");
const fs = require("fs");
const path = require("path");

// ================= Upload Document =================

exports.uploadDocument = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a PDF file."
            });
        }

        let {
            title,
            description,
            certificateType,
            issuedBy,
            issueDate
        } = req.body;

        if (!title || !certificateType || !issuedBy || !issueDate) {

            fs.unlinkSync(req.file.path);

            return res.status(400).json({
                message: "All required fields must be provided."
            });

        }

        title = title.trim();
        description = description ? description.trim() : null;
        certificateType = certificateType.trim();
        issuedBy = issuedBy.trim();

        const fileHash = generateFileHash(req.file.path);

        const existingDocument = await prisma.document.findUnique({
            where: {
                fileHash
            }
        });

        if (existingDocument) {

            fs.unlinkSync(req.file.path);

            return res.status(409).json({
                message: "Certificate already exists."
            });

        }

        const blockchain = await storeHashOnBlockchain(fileHash);

        console.log("=================================");
        console.log("Blockchain Response:");
        console.log(blockchain);
        console.log("=================================");

        if (!blockchain.success) {
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(500).json({
                message: "Failed to store certificate on blockchain.",
                error: blockchain.error
            });
        }

        const document = await prisma.document.create({

            data: {

                title,
                description,
                certificateType,

                fileName: req.file.filename,
                fileHash,

                issuedBy,
                issueDate: new Date(issueDate),

                blockchainTxId: blockchain.transactionId,

                userId: req.user.id

            }

        });

        return res.status(201).json({

            message: "Certificate uploaded successfully.",

            document

        });

    } catch (error) {

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};

// ================= My Documents =================

exports.getMyDocuments = async (req, res) => {

    try {

        const documents = await prisma.document.findMany({

            where: {
                userId: req.user.id
            },

            orderBy: {
                uploadedAt: "desc"
            }

        });

        return res.status(200).json({
            documents
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};

// ================= Get Document By ID =================

exports.getDocumentById = async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid document ID."
            });
        }

        const document = await prisma.document.findUnique({

            where: {
                id
            }

        });

        if (!document) {

            return res.status(404).json({
                message: "Document not found."
            });

        }

        if (
            req.user.role !== "ADMIN" &&
            document.userId !== req.user.id
        ) {

            return res.status(403).json({
                message: "Access denied."
            });

        }

        return res.status(200).json(document);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};

// ================= Delete Document =================

exports.deleteDocument = async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid document ID."
            });
        }

        const document = await prisma.document.findUnique({
            where: {
                id
            }
        });

        if (!document) {
            return res.status(404).json({
                message: "Document not found."
            });
        }

        if (
            req.user.role !== "ADMIN" &&
            document.userId !== req.user.id
        ) {
            return res.status(403).json({
                message: "Access denied."
            });
        }

        const filePath = path.join(
            __dirname,
            "..",
            "uploads",
            document.fileName
        );

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await prisma.document.delete({
            where: {
                id
            }
        });

        return res.status(200).json({
            message: "Document deleted successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};

// ================= Download Document =================

exports.downloadDocument = async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid document ID."
            });
        }

        const document = await prisma.document.findUnique({
            where: {
                id
            }
        });

        if (!document) {
            return res.status(404).json({
                message: "Document not found."
            });
        }

        if (
            req.user.role !== "ADMIN" &&
            document.userId !== req.user.id
        ) {
            return res.status(403).json({
                message: "Access denied."
            });
        }

        const filePath = path.join(
            __dirname,
            "..",
            "uploads",
            document.fileName
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                message: "File not found."
            });
        }

        return res.download(filePath);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};

// ================= Verify Document =================

exports.verifyDocument = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                verified: false,
                message: "Please upload a certificate."
            });
        }

        const fileHash = generateFileHash(req.file.path);

        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        const document = await prisma.document.findUnique({
            where: {
                fileHash
            }
        });

        if (!document) {
            return res.status(404).json({
                verified: false,
                message: "Certificate not found."
            });
        }

        return res.status(200).json({

            verified: true,

            document: {

                id: document.id,
                title: document.title,
                description: document.description,
                certificateType: document.certificateType,
                issuedBy: document.issuedBy,
                issueDate: document.issueDate,
                verificationStatus: document.verificationStatus,
                blockchainTxId: document.blockchainTxId,
                fileHash: document.fileHash,
                uploadedAt: document.uploadedAt

            }

        });

    } catch (error) {

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        console.error(error);

        return res.status(500).json({
            verified: false,
            message: "Internal Server Error"
        });

    }

};