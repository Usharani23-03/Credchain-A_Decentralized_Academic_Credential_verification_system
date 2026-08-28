const prisma = require("../config/prisma");

const {
    storeHashOnBlockchain,
    verifyHashOnBlockchain
} = require("../services/blockchainService");

const uploadToPinata =
    require("../services/pinataService");

const generateSHA512 =
    require("../utils/hashGenerator");

const generateVerificationQR =
    require("../utils/qrGenerator");

const fs = require("fs");

const path = require("path");

const { PDFDocument } =
    require("pdf-lib");


// ============================================================
// Helper: Create Notification
// ============================================================

const createNotification = async (
    userId,
    title,
    message,
    type = "INFO"
) => {

    try {

        if (!userId) {
            return null;
        }

        return await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                isRead: false
            }
        });

    } catch (error) {

        console.error(
            "NOTIFICATION CREATION ERROR:",
            error.message
        );

        // Notification failure should not stop
        // certificate issuing or verification
        return null;
    }

};


// ============================================================
// Helper: Create Certificate PDF with QR
// ============================================================

const createCertificateWithQR = async (
    originalPdfPath,
    outputPdfPath,
    qrDataURL,
    certificateId
) => {

    const existingPdfBytes =
        fs.readFileSync(originalPdfPath);

    const pdfDoc =
        await PDFDocument.load(
            existingPdfBytes
        );

    const pages =
        pdfDoc.getPages();

    if (!pages.length) {

        throw new Error(
            "Certificate PDF has no pages."
        );

    }

    const page =
        pages[pages.length - 1];

    const { width, height } =
        page.getSize();

    const base64Data =
        qrDataURL.replace(
            /^data:image\/png;base64,/,
            ""
        );

    const qrBytes =
        Buffer.from(
            base64Data,
            "base64"
        );

    const qrImage =
        await pdfDoc.embedPng(
            qrBytes
        );

    const qrSize = 100;

    const margin = 40;

    let qrX = margin;

    let qrY = margin + 30;

    if (
        qrY + qrSize + 40 > height
    ) {

        qrY = 40;

    }

    if (
        qrX + qrSize > width
    ) {

        qrX =
            width -
            qrSize -
            margin;

    }

    page.drawImage(qrImage, {

        x: qrX,
        y: qrY,
        width: qrSize,
        height: qrSize

    });

    page.drawText(
        `Certificate ID: ${certificateId}`,
        {

            x: qrX,
            y: qrY - 15,
            size: 7

        }
    );

    page.drawText(
        "Scan QR to verify",
        {

            x: qrX,
            y: qrY + qrSize + 5,
            size: 8

        }
    );

    const finalPdfBytes =
        await pdfDoc.save();

    fs.writeFileSync(
        outputPdfPath,
        finalPdfBytes
    );

};


// ============================================================
// Upload / Issue Document
// ============================================================

exports.uploadDocument = async (
    req,
    res
) => {

    let originalFilePath = null;

    let finalFilePath = null;

    try {

        if (!req.file) {

            return res.status(400).json({

                message:
                    "Please upload a PDF file."

            });

        }

        originalFilePath =
            req.file.path;


        // ====================================================
        // Validate PDF
        // ====================================================

        if (
            req.file.mimetype !==
            "application/pdf"
        ) {

            if (
                fs.existsSync(
                    originalFilePath
                )
            ) {

                fs.unlinkSync(
                    originalFilePath
                );

            }

            return res.status(400).json({

                message:
                    "Only PDF certificates are allowed."

            });

        }


        // ====================================================
        // Get Request Data
        // ====================================================

        let {

            title,
            description,
            certificateType,
            issuedBy,
            issueDate,
            hasExistingQR,
            studentEmail

        } = req.body;


        // ====================================================
        // Validate Required Fields
        // ====================================================

        if (
            !title ||
            !certificateType ||
            !issuedBy ||
            !issueDate
        ) {

            if (
                fs.existsSync(
                    originalFilePath
                )
            ) {

                fs.unlinkSync(
                    originalFilePath
                );

            }

            return res.status(400).json({

                message:
                    "All required fields must be provided."

            });

        }


        // ====================================================
        // Clean Input
        // ====================================================

        title =
            title.trim();

        description =
            description
                ? description.trim()
                : null;

        certificateType =
            certificateType.trim();

        issuedBy =
            issuedBy.trim();

        studentEmail =
            studentEmail
                ? studentEmail
                    .trim()
                    .toLowerCase()
                : null;


        // ====================================================
        // Student Email Required
        // ====================================================

        if (!studentEmail) {

            if (
                fs.existsSync(
                    originalFilePath
                )
            ) {

                fs.unlinkSync(
                    originalFilePath
                );

            }

            return res.status(400).json({

                message:
                    "Student email is required."

            });

        }


        // ====================================================
        // Find Student
        // ====================================================

        const student =
            await prisma.user.findUnique({

                where: {

                    email:
                        studentEmail

                }

            });


        if (!student) {

            if (
                fs.existsSync(
                    originalFilePath
                )
            ) {

                fs.unlinkSync(
                    originalFilePath
                );

            }

            return res.status(404).json({

                message:
                    "Student with the provided email was not found."

            });

        }


        if (
            student.role !==
            "STUDENT"
        ) {

            if (
                fs.existsSync(
                    originalFilePath
                )
            ) {

                fs.unlinkSync(
                    originalFilePath
                );

            }

            return res.status(400).json({

                message:
                    "The provided email does not belong to a student."

            });

        }


        const studentId =
            student.id;


        console.log("");

        console.log(
            "================================="
        );

        console.log(
            "STUDENT ASSIGNMENT"
        );

        console.log(
            "================================="
        );

        console.log(
            "Student:",
            student.name
        );

        console.log(
            "Student Email:",
            student.email
        );

        console.log(
            "Student ID:",
            studentId
        );

        console.log(
            "================================="
        );


        // ====================================================
        // QR Handling
        // ====================================================

        const preserveExistingQR =
            hasExistingQR === "true" ||
            hasExistingQR === true;


        const certificateId =
            `CERT-${Date.now()}`;


        let verificationURL =
            null;

        let qrGenerated =
            false;


        let finalFileName =
            req.file.originalname;


        finalFilePath =
            path.join(
                path.dirname(
                    originalFilePath
                ),
                finalFileName
            );


        if (
            preserveExistingQR
        ) {

            finalFilePath =
                originalFilePath;

            finalFileName =
                req.file.originalname;

        } else {

            const qr =
                await generateVerificationQR(
                    certificateId
                );

            verificationURL =
                qr.verificationURL;

            qrGenerated =
                true;

            finalFileName =
                `certificate-${certificateId}.pdf`;

            finalFilePath =
                path.join(
                    path.dirname(
                        originalFilePath
                    ),
                    finalFileName
                );


            await createCertificateWithQR(

                originalFilePath,

                finalFilePath,

                qr.qrDataURL,

                certificateId

            );

        }


        // ====================================================
        // Generate SHA-512 Hash
        // ====================================================

        const sha512Hash =
            generateSHA512(
                finalFilePath
            );

        const fileHash =
            sha512Hash;


        // ====================================================
        // Check Duplicate Certificate
        // ====================================================

        const existingDocument =
            await prisma.document.findUnique({

                where: {

                    fileHash

                }

            });


        if (existingDocument) {

            if (
                fs.existsSync(
                    originalFilePath
                )
            ) {

                fs.unlinkSync(
                    originalFilePath
                );

            }


            if (
                finalFilePath !==
                originalFilePath &&
                fs.existsSync(
                    finalFilePath
                )
            ) {

                fs.unlinkSync(
                    finalFilePath
                );

            }


            return res.status(409).json({

                message:
                    "Certificate already exists."

            });

        }


        // ====================================================
        // Upload to IPFS
        // ====================================================

        const ipfsResult =
            await uploadToPinata(

                finalFilePath,

                finalFileName

            );


        if (
            !ipfsResult ||
            !ipfsResult.IpfsHash
        ) {

            throw new Error(
                "IPFS upload failed."
            );

        }


        // ====================================================
        // Store on Blockchain
        // ====================================================

        const blockchain =
            await storeHashOnBlockchain(

                sha512Hash,

                certificateId,

                title,

                certificateId,

                certificateType,

                issuedBy,

                ipfsResult.IpfsHash

            );


        if (!blockchain.success) {

            if (
                finalFilePath !==
                originalFilePath &&
                fs.existsSync(
                    finalFilePath
                )
            ) {

                fs.unlinkSync(
                    finalFilePath
                );

            }


            if (
                originalFilePath &&
                fs.existsSync(
                    originalFilePath
                )
            ) {

                fs.unlinkSync(
                    originalFilePath
                );

            }


            return res.status(500).json({

                message:
                    "Failed to store certificate on blockchain.",

                error:
                    blockchain.error

            });

        }


        // ====================================================
        // Store in PostgreSQL
        // ====================================================

        const document =
            await prisma.document.create({

                data: {

                    title,

                    description,

                    certificateType,

                    fileName:
                        finalFileName,

                    fileHash,

                    certificateId,

                    verificationUrl:
                        verificationURL,

                    issuedBy,

                    issueDate:
                        new Date(
                            issueDate
                        ),

                    blockchainTxId:
                        certificateId,

                    ipfsHash:
                        ipfsResult.IpfsHash,

                    sha512Hash,

                    // University / issuer
                    userId:
                        req.user.id,

                    // Student / owner
                    studentId:
                        studentId

                }

            });


        // ====================================================
        // CREATE REAL NOTIFICATIONS
        // ====================================================

        // Notification for University
        await createNotification(

            req.user.id,

            "Certificate Issued",

            `You successfully issued "${title}" to ${student.name}.`,

            "CERTIFICATE_ISSUED"

        );


        // Notification for Student
        await createNotification(

            student.id,

            "New Certificate Received",

            `${issuedBy} issued you a new certificate: "${title}".`,

            "CERTIFICATE_RECEIVED"

        );


        console.log(
            "Notifications created for university and student."
        );


        // ====================================================
        // Remove Original File
        // ====================================================

        if (
            finalFilePath !==
            originalFilePath &&
            originalFilePath &&
            fs.existsSync(
                originalFilePath
            )
        ) {

            fs.unlinkSync(
                originalFilePath
            );

        }


        // ====================================================
        // Response
        // ====================================================

        return res.status(201).json({

            message:
                "Certificate uploaded and issued successfully.",

            certificateId,

            verificationURL,

            qrGenerated,

            existingQRPreserved:
                preserveExistingQR,

            student: {

                id:
                    student.id,

                name:
                    student.name,

                email:
                    student.email

            },

            document

        });


    } catch (error) {

        console.error(
            "CERTIFICATE UPLOAD ERROR:",
            error
        );


        if (
            originalFilePath &&
            fs.existsSync(
                originalFilePath
            )
        ) {

            fs.unlinkSync(
                originalFilePath
            );

        }


        if (
            finalFilePath &&
            finalFilePath !==
            originalFilePath &&
            fs.existsSync(
                finalFilePath
            )
        ) {

            fs.unlinkSync(
                finalFilePath
            );

        }


        return res.status(500).json({

            message:
                "Internal Server Error",

            error:
                error.message

        });

    }

};


// ============================================================
// Get My Documents
// ============================================================

exports.getMyDocuments = async (
    req,
    res
) => {

    try {

        let whereClause = {};


        // STUDENT
        if (
            req.user.role ===
            "STUDENT"
        ) {

            whereClause = {

                studentId:
                    req.user.id

            };

        }


        // UNIVERSITY
        else if (
            req.user.role ===
            "UNIVERSITY"
        ) {

            whereClause = {

                userId:
                    req.user.id

            };

        }


        // EMPLOYER
        else if (
            req.user.role ===
            "EMPLOYER"
        ) {

            return res.status(200).json({

                documents: []

            });

        }


        const documents =
            await prisma.document.findMany({

                where:
                    whereClause,

                orderBy: {

                    uploadedAt:
                        "desc"

                }

            });


        return res.status(200).json({

            documents

        });


    } catch (error) {

        console.error(
            "GET MY DOCUMENTS ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Internal Server Error"

        });

    }

};


// ============================================================
// Helper: Check Document Access
// ============================================================

const canAccessDocument =
    (
        document,
        user
    ) => {

        if (
            user.role ===
            "ADMIN"
        ) {

            return true;

        }


        // University that issued certificate
        if (
            document.userId ===
            user.id
        ) {

            return true;

        }


        // Student who owns certificate
        if (
            document.studentId ===
            user.id
        ) {

            return true;

        }


        return false;

    };


// ============================================================
// Get Document By ID
// ============================================================

exports.getDocumentById =
    async (
        req,
        res
    ) => {

        try {

            const id =
                Number(
                    req.params.id
                );


            if (isNaN(id)) {

                return res.status(400).json({

                    message:
                        "Invalid document ID."

                });

            }


            const document =
                await prisma.document.findUnique({

                    where: {

                        id

                    }

                });


            if (!document) {

                return res.status(404).json({

                    message:
                        "Document not found."

                });

            }


            if (
                !canAccessDocument(
                    document,
                    req.user
                )
            ) {

                return res.status(403).json({

                    message:
                        "Access denied."

                });

            }


            return res.status(200).json(
                document
            );


        } catch (error) {

            console.error(error);

            return res.status(500).json({

                message:
                    "Internal Server Error"

            });

        }

    };


// ============================================================
// Delete Document
// ============================================================

exports.deleteDocument =
    async (
        req,
        res
    ) => {

        try {

            const id =
                Number(
                    req.params.id
                );


            const document =
                await prisma.document.findUnique({

                    where: {

                        id

                    }

                });


            if (!document) {

                return res.status(404).json({

                    message:
                        "Document not found."

                });

            }


            const canDelete =

                req.user.role ===
                    "ADMIN" ||

                document.userId ===
                    req.user.id;


            if (!canDelete) {

                return res.status(403).json({

                    message:
                        "Access denied."

                });

            }


            const filePath =
                path.join(

                    __dirname,

                    "..",

                    "uploads",

                    document.fileName

                );


            if (
                fs.existsSync(
                    filePath
                )
            ) {

                fs.unlinkSync(
                    filePath
                );

            }


            await prisma.document.delete({

                where: {

                    id

                }

            });


            // Notification after deletion
            await createNotification(

                req.user.id,

                "Certificate Deleted",

                `The certificate "${document.title}" was deleted.`,

                "CERTIFICATE_DELETED"

            );


            return res.status(200).json({

                message:
                    "Document deleted successfully."

            });


        } catch (error) {

            console.error(error);

            return res.status(500).json({

                message:
                    "Internal Server Error"

            });

        }

    };


// ============================================================
// Download Document
// ============================================================

exports.downloadDocument =
    async (
        req,
        res
    ) => {

        try {

            const id =
                Number(
                    req.params.id
                );


            const document =
                await prisma.document.findUnique({

                    where: {

                        id

                    }

                });


            if (!document) {

                return res.status(404).json({

                    message:
                        "Document not found."

                });

            }


            if (
                !canAccessDocument(
                    document,
                    req.user
                )
            ) {

                return res.status(403).json({

                    message:
                        "Access denied."

                });

            }


            const filePath =
                path.join(

                    __dirname,

                    "..",

                    "uploads",

                    document.fileName

                );


            if (
                !fs.existsSync(
                    filePath
                )
            ) {

                return res.status(404).json({

                    message:
                        "File not found."

                });

            }


            return res.download(

                filePath,

                document.fileName

            );


        } catch (error) {

            console.error(error);

            return res.status(500).json({

                message:
                    "Internal Server Error"

            });

        }

    };


// ============================================================
// Verify Document
// ============================================================

exports.verifyDocument =
    async (
        req,
        res
    ) => {

        try {

            if (!req.file) {

                return res.status(400).json({

                    verified:
                        false,

                    blockchainVerified:
                        false,

                    message:
                        "Please upload a certificate."

                });

            }


            const uploadedFilePath =
                req.file.path;


            const sha512Hash =
                generateSHA512(
                    uploadedFilePath
                );


            const document =
                await prisma.document.findFirst({

                    where: {

                        sha512Hash

                    }

                });


            if (
                fs.existsSync(
                    uploadedFilePath
                )
            ) {

                fs.unlinkSync(
                    uploadedFilePath
                );

            }


            if (!document) {

                // Create failed verification notification
                if (req.user) {

                    await createNotification(

                        req.user.id,

                        "Certificate Verification Failed",

                        "The uploaded certificate was not found or may have been modified.",

                        "VERIFICATION_FAILED"

                    );

                }


                return res.status(404).json({

                    verified:
                        false,

                    blockchainVerified:
                        false,

                    message:
                        "Certificate not found or certificate has been modified."

                });

            }


            const blockchain =
                await verifyHashOnBlockchain(

                    document.certificateId,

                    sha512Hash

                );


            if (
                !blockchain.exists
            ) {

                if (req.user) {

                    await createNotification(

                        req.user.id,

                        "Blockchain Verification Failed",

                        `Certificate "${document.title}" could not be verified on the blockchain.`,

                        "VERIFICATION_FAILED"

                    );

                }


                return res.status(404).json({

                    verified:
                        false,

                    blockchainVerified:
                        false,

                    message:
                        "Certificate could not be verified on blockchain.",

                    certificateId:
                        document.certificateId

                });

            }


            const updatedDocument =
                await prisma.document.update({

                    where: {

                        id:
                            document.id

                    },

                    data: {

                        verificationStatus:
                            "VERIFIED"

                    }

                });


            // ====================================================
            // EMPLOYER VERIFICATION HISTORY
            // ====================================================

            if (
                req.user &&
                req.user.role ===
                    "EMPLOYER"
            ) {

                await prisma.verificationHistory.create({

                    data: {

                        documentId:
                            updatedDocument.id,

                        employerId:
                            req.user.id,

                        status:
                            "VERIFIED"

                    }

                });

            }


            // ====================================================
            // REAL VERIFICATION NOTIFICATION
            // ====================================================

            if (req.user) {

                await createNotification(

                    req.user.id,

                    "Certificate Verified",

                    `Certificate "${updatedDocument.title}" was verified successfully on the blockchain.`,

                    "VERIFICATION_SUCCESS"

                );

            }


            return res.status(200).json({

                verified:
                    true,

                blockchainVerified:
                    true,

                message:
                    "Certificate verified successfully.",

                certificateId:
                    document.certificateId,

                verificationURL:
                    document.verificationUrl,

                document: {

                    id:
                        updatedDocument.id,

                    title:
                        updatedDocument.title,

                    description:
                        updatedDocument.description,

                    certificateType:
                        updatedDocument.certificateType,

                    certificateId:
                        updatedDocument.certificateId,

                    verificationUrl:
                        updatedDocument.verificationUrl,

                    issuedBy:
                        updatedDocument.issuedBy,

                    issueDate:
                        updatedDocument.issueDate,

                    verificationStatus:
                        updatedDocument.verificationStatus,

                    blockchainTxId:
                        updatedDocument.blockchainTxId,

                    sha512Hash:
                        updatedDocument.sha512Hash,

                    fileHash:
                        updatedDocument.fileHash,

                    ipfsHash:
                        updatedDocument.ipfsHash,

                    uploadedAt:
                        updatedDocument.uploadedAt

                }

            });


        } catch (error) {

            console.error(

                "CERTIFICATE VERIFICATION ERROR:",

                error

            );


            if (
                req.file &&
                fs.existsSync(
                    req.file.path
                )
            ) {

                fs.unlinkSync(
                    req.file.path
                );

            }


            return res.status(500).json({

                verified:
                    false,

                blockchainVerified:
                    false,

                message:
                    "Internal Server Error",

                error:
                    error.message

            });

        }

    };


// ============================================================
// Employer Verification History
// ============================================================

exports.getVerificationHistory =
    async (
        req,
        res
    ) => {

        try {

            const history =
                await prisma.verificationHistory.findMany({

                    where: {

                        employerId:
                            req.user.id

                    },

                    include: {

                        document:
                            true

                    },

                    orderBy: {

                        verifiedAt:
                            "desc"

                    }

                });


            return res.status(200).json({

                history

            });


        } catch (error) {

            console.error(error);

            return res.status(500).json({

                message:
                    "Internal Server Error"

            });

        }

    };