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

const extractCertificateId =
    require("../utils/extractCertificateId");
const fs = require("fs");

const path = require("path");

const { PDFDocument } = require("pdf-lib");
const sharp = require("sharp");




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
        await PDFDocument.load(existingPdfBytes);

    const pages =
        pdfDoc.getPages();

    if (!pages.length) {
        throw new Error(
            "Certificate PDF has no pages."
        );
    }

    // Add QR to the last page
    const page =
        pages[pages.length - 1];

    const { width, height } =
        page.getSize();

    // Convert QR data URL to PNG bytes
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

    // QR size
    const qrSize = 100;

    // Position
    const margin = 40;

    let qrX = margin;
    let qrY = margin + 30;

    // Prevent QR from going outside page
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

    // Draw QR
    page.drawImage(qrImage, {
        x: qrX,
        y: qrY,
        width: qrSize,
        height: qrSize
    });

    // Certificate ID
    page.drawText(
        `Certificate ID: ${certificateId}`,
        {
            x: qrX,
            y: qrY - 15,
            size: 7
        }
    );

    // Verification text
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
// Helper: Create Image Certificate with QR
// Supports JPG, JPEG and PNG
// ============================================================

const createImageCertificateWithQR = async (
    originalImagePath,
    outputImagePath,
    qrDataURL,
    certificateId
) => {
    try {
        // Convert QR data URL to PNG buffer
        const base64Data =
            qrDataURL.replace(
                /^data:image\/png;base64,/,
                ""
            );

        const qrBuffer =
            Buffer.from(
                base64Data,
                "base64"
            );

        // Get image metadata
        const metadata =
            await sharp(
                originalImagePath
            ).metadata();

        if (
            !metadata.width ||
            !metadata.height
        ) {
            throw new Error(
                "Unable to determine image dimensions."
            );
        }

        const imageWidth =
            metadata.width;

        const imageHeight =
            metadata.height;

        // QR size
        const qrSize = Math.min(
            300,
            Math.max(
                150,
                Math.floor(
                    imageWidth * 0.18
                )
            )
        );

        // Resize QR
        const resizedQR =
            await sharp(qrBuffer)
                .resize(
                    qrSize,
                    qrSize
                )
                .png()
                .toBuffer();

        // Margin
        const margin =
            Math.max(
                30,
                Math.floor(
                    imageWidth * 0.03
                )
            );

        // Bottom-right position
        const qrX =
            imageWidth -
            qrSize -
            margin;

        const qrY =
            Math.max(
                10,
                imageHeight -
                qrSize -
                margin -
                70
            );

        // Text overlay
        const textWidth =
            Math.min(
                700,
                qrSize + 200
            );

        const textSvg = `
            <svg
                width="${textWidth}"
                height="70"
                xmlns="http://www.w3.org/2000/svg"
            >
                <style>
                    .id {
                        font-family: Arial, sans-serif;
                        font-size: 18px;
                        font-weight: bold;
                        fill: black;
                    }

                    .verify {
                        font-family: Arial, sans-serif;
                        font-size: 16px;
                        fill: black;
                    }
                </style>

                <rect
                    x="0"
                    y="0"
                    width="${textWidth}"
                    height="70"
                    rx="5"
                    fill="white"
                    fill-opacity="0.90"
                />

                <text
                    x="10"
                    y="25"
                    class="id"
                >
                    Certificate ID: ${certificateId}
                </text>

                <text
                    x="10"
                    y="52"
                    class="verify"
                >
                    Scan QR to verify
                </text>
            </svg>
        `;

        const textBuffer =
            Buffer.from(textSvg);

        // Determine output format
        const outputFormat =
            metadata.format === "png"
                ? "png"
                : "jpeg";

        // Create final image
        let imagePipeline =
            sharp(originalImagePath)
                .composite([
                    {
                        input: resizedQR,
                        left: qrX,
                        top: qrY
                    },
                    {
                        input: textBuffer,
                        left: Math.max(
                            0,
                            qrX -
                            20
                        ),
                        top:
                            qrY +
                            qrSize +
                            5
                    }
                ]);

        // Preserve image type
        if (
            outputFormat === "png"
        ) {
            imagePipeline =
                imagePipeline.png();
        } else {
            imagePipeline =
                imagePipeline.jpeg({
                    quality: 95
                });
        }

        await imagePipeline.toFile(
            outputImagePath
        );

        console.log(
            "Image certificate created with QR:",
            outputImagePath
        );

    } catch (error) {
        console.error(
            "IMAGE QR GENERATION ERROR:",
            error
        );

        throw error;
    }
};


// ============================================================
// Upload / Issue Document
// ============================================================

// ============================================================
// Upload / Issue Document
// Supports PDF, JPG, JPEG and PNG
// ============================================================

exports.uploadDocument = async (
    req,
    res
) => {

    let originalFilePath = null;
    let finalFilePath = null;

    try {

        // ====================================================
        // 1. Check uploaded file
        // ====================================================

        if (!req.file) {
            return res.status(400).json({
                message:
                    "Please upload a PDF, JPG, JPEG, or PNG certificate."
            });
        }

        originalFilePath =
            req.file.path;


        // ====================================================
        // 2. Validate file type
        // ====================================================

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

        const fileExtension =
            path.extname(
                req.file.originalname
            ).toLowerCase();

        const isAllowed =
            allowedMimeTypes.includes(
                req.file.mimetype
            ) &&
            allowedExtensions.includes(
                fileExtension
            );

        if (!isAllowed) {

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
                    "Only PDF, JPG, JPEG, and PNG certificates are allowed."
            });
        }


        // ====================================================
        // 3. Get Request Data
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
        // 4. Validate Required Fields
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
        // 5. Clean Input
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
        // 6. Student Email Required
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
        // 7. Find Student
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


        // ====================================================
        // 8. Verify Student Role
        // ====================================================

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
        // 9. QR Handling
        // ====================================================

        const preserveExistingQR =
            hasExistingQR === "true" ||
            hasExistingQR === true;


        // Generate unique certificate ID
        const certificateId =
            `CERT-${Date.now()}`;


        let verificationURL =
            null;

        let qrGenerated =
            false;


        // ====================================================
        // 10. Determine File Type
        // ====================================================

        const isPDF =
            req.file.mimetype ===
            "application/pdf";

        const isImage =
            req.file.mimetype ===
                "image/jpeg" ||
            req.file.mimetype ===
                "image/png";


        // ====================================================
        // 11. Prepare Final File
        // ====================================================

        let finalFileName =
            req.file.originalname;

        finalFilePath =
            path.join(
                path.dirname(
                    originalFilePath
                ),
                finalFileName
            );


        // ====================================================
        // 12. Existing QR
        // ====================================================

        if (
            preserveExistingQR
        ) {

            finalFilePath =
                originalFilePath;

            finalFileName =
                req.file.filename;

        }

        // ====================================================
        // 13. Generate New QR
        // ====================================================

        else {

            const qr =
                await generateVerificationQR(
                    certificateId
                );

            verificationURL =
                qr.verificationURL;

            qrGenerated =
                true;


            // =================================================
            // PDF Certificate
            // =================================================

            if (isPDF) {

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


            // =================================================
            // Image Certificate
            // =================================================

            else if (isImage) {

                const imageExtension =
                    fileExtension === ".png"
                        ? ".png"
                        : ".jpg";

                finalFileName =
                    `certificate-${certificateId}${imageExtension}`;

                finalFilePath =
                    path.join(
                        path.dirname(
                            originalFilePath
                        ),
                        finalFileName
                    );

                await createImageCertificateWithQR(
                    originalFilePath,
                    finalFilePath,
                    qr.qrDataURL,
                    certificateId
                );
            }

            else {

                throw new Error(
                    "Unsupported certificate file type."
                );
            }
        }


        // ====================================================
        // 14. Generate SHA-512 Hash
        // ====================================================

        const sha512Hash =
            generateSHA512(
                finalFilePath
            );

        const fileHash =
            sha512Hash;


        console.log(
            "Final certificate SHA-512:",
            sha512Hash
        );


        // ====================================================
        // 15. Check Duplicate Certificate
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
        // 16. Upload to IPFS
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


        console.log(
            "Certificate uploaded to IPFS:",
            ipfsResult.IpfsHash
        );


        // ====================================================
        // 17. Store Hash on Hyperledger Fabric
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


        console.log(
            "Certificate successfully stored on blockchain."
        );


        // ====================================================
        // 18. Store in PostgreSQL
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
        // 19. Create University Notification
        // ====================================================

        await createNotification(
            req.user.id,
            "Certificate Issued",
            `You successfully issued "${title}" to ${student.name}.`,
            "CERTIFICATE_ISSUED"
        );


        // ====================================================
        // 20. Create Student Notification
        // ====================================================

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
        // 21. Remove Original File
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
        // 22. Response
        // ====================================================

        return res.status(201).json({

            message:
                "Certificate uploaded and issued successfully.",

            certificateId,

            verificationURL,

            qrGenerated,

            existingQRPreserved:
                preserveExistingQR,

            fileType:
                isPDF
                    ? "PDF"
                    : "IMAGE",

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


        // Remove original uploaded file
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


        // Remove generated final file
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

exports.downloadDocument = async (req, res) => {

    try {

        const id = Number(req.params.id);

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

        if (!canAccessDocument(document, req.user)) {
            return res.status(403).json({
                message: "Access denied."
            });
        }

        const uploadsDir = path.join(
            __dirname,
            "..",
            "uploads"
        );

        // ----------------------------------------------------
        // First try the exact filename stored in database
        // ----------------------------------------------------

        let filePath = path.join(
            uploadsDir,
            document.fileName
        );

        // ----------------------------------------------------
        // Existing-QR certificates may have been stored with
        // the original filename while multer added a timestamp
        // to the actual file on disk.
        // ----------------------------------------------------

        if (!fs.existsSync(filePath)) {

            const files = fs.readdirSync(uploadsDir);

            const matchingFile = files.find(
                (file) =>
                    file.endsWith(
                        `-${document.fileName}`
                    )
            );

            if (matchingFile) {

                filePath = path.join(
                    uploadsDir,
                    matchingFile
                );

                console.log(
                    "Found timestamped certificate file:",
                    matchingFile
                );

            }

        }

        // ----------------------------------------------------
        // File still not found
        // ----------------------------------------------------

        if (!fs.existsSync(filePath)) {

            console.error(
                "DOWNLOAD FILE NOT FOUND:",
                document.fileName
            );

            return res.status(404).json({
                message: "Certificate file not found on server."
            });

        }

        console.log(
            "Downloading certificate:",
            filePath
        );

        // Keep the original certificate filename
        return res.download(
            filePath,
            document.fileName
        );

    } catch (error) {

        console.error(
            "DOWNLOAD ERROR:",
            error
        );

        return res.status(500).json({
            message: "Internal Server Error."
        });

    }

};


// ============================================================
// Verify Document
// ============================================================



exports.verifyDocument = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                verified: false,

                blockchainVerified: false,

                message:
                    "Please upload a certificate."

            });

        }


        const uploadedFilePath =
            req.file.path;


        // ====================================================
        // 1. Extract Certificate ID
        // ====================================================

        // First match the complete uploaded file against issued certificates.
        // This supports image certificates as well as PDFs, since only PDFs can
        // be searched for the printed Certificate ID below.
        const uploadedSha512 =
            generateSHA512(uploadedFilePath);

        const exactFileMatch =
            await prisma.document.findFirst({
                where: {
                    sha512Hash: uploadedSha512
                }
            });

        const extractedCertificateId = exactFileMatch
            ? exactFileMatch.certificateId
            : await extractCertificateId(uploadedFilePath);

        console.log("");
        console.log("=================================");
        console.log("CERTIFICATE VERIFICATION");
        console.log("=================================");
        console.log(
            "Uploaded file:",
            req.file.originalname
        );
        console.log(
            "Extracted Certificate ID:",
            extractedCertificateId
        );


        // ====================================================
        // 2. Certificate ID is required
        // ====================================================

        if (!extractedCertificateId) {

            if (
                fs.existsSync(
                    uploadedFilePath
                )
            ) {
                fs.unlinkSync(
                    uploadedFilePath
                );
            }

            return res.status(404).json({

                verified: false,

                blockchainVerified: false,

                message:
                    "Certificate not found. No valid Certificate ID was found in the uploaded document."

            });

        }


        // ====================================================
        // 3. Find certificate by Certificate ID
        // ====================================================

        const document =
            await prisma.document.findUnique({

                where: {

                    certificateId:
                        extractedCertificateId

                }

            });


        // ====================================================
        // 4. Certificate does not exist
        // ====================================================

        if (!document) {

            if (
                fs.existsSync(
                    uploadedFilePath
                )
            ) {
                fs.unlinkSync(
                    uploadedFilePath
                );
            }


            if (req.user) {

                await createNotification(

                    req.user.id,

                    "Certificate Verification Failed",

                    `Certificate "${extractedCertificateId}" is not registered in CredChain.`,

                    "VERIFICATION_FAILED"

                );

            }


            return res.status(404).json({

                verified: false,

                blockchainVerified: false,

                message:
                    "Certificate not found. This certificate is not registered in CredChain.",

                certificateId:
                    extractedCertificateId

            });

        }


        // ====================================================
        // 5. Generate SHA-512
        // ====================================================

        const sha512Hash = uploadedSha512;


        console.log(
            "Uploaded SHA-512:",
            sha512Hash
        );

        console.log(
            "Stored SHA-512:",
            document.sha512Hash
        );


        // ====================================================
        // 6. Compare SHA-512
        // ====================================================

        if (
            sha512Hash !==
            document.sha512Hash
        ) {

            if (
                fs.existsSync(
                    uploadedFilePath
                )
            ) {
                fs.unlinkSync(
                    uploadedFilePath
                );
            }


            if (req.user) {

                await createNotification(

                    req.user.id,

                    "Certificate Tampered",

                    `Certificate "${document.title}" was found, but its contents have been modified.`,

                    "VERIFICATION_FAILED"

                );

            }


            return res.status(200).json({

                verified: false,

                blockchainVerified: false,

                tampered: true,

                message:
                    "Certificate found, but the uploaded file has been modified.",

                certificateId:
                    document.certificateId

            });

        }


        // ====================================================
        // 7. SHA-512 matched
        // ====================================================

        if (
            fs.existsSync(
                uploadedFilePath
            )
        ) {
            fs.unlinkSync(
                uploadedFilePath
            );
        }


        // ====================================================
        // 8. Verify with Hyperledger Fabric
        // ====================================================

        const blockchain =
            await verifyHashOnBlockchain(

                document.certificateId,

                sha512Hash

            );


        if (!blockchain.exists) {

            if (req.user) {

                await createNotification(

                    req.user.id,

                    "Blockchain Verification Failed",

                    `Certificate "${document.title}" could not be verified on the blockchain.`,

                    "VERIFICATION_FAILED"

                );

            }


            return res.status(404).json({

                verified: false,

                blockchainVerified: false,

                message:
                    "Certificate could not be verified on blockchain.",

                certificateId:
                    document.certificateId

            });

        }


        // ====================================================
        // 9. Update verification status
        // ====================================================

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
        // 10. Employer Verification History
        // ====================================================

        if (
            req.user &&
            req.user.role === "EMPLOYER"
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
        // 11. Success Notification
        // ====================================================

        if (req.user) {

            await createNotification(

                req.user.id,

                "Certificate Verified",

                `Certificate "${updatedDocument.title}" was verified successfully on the blockchain.`,

                "VERIFICATION_SUCCESS"

            );

        }


        // ====================================================
        // 12. Successful Verification Response
        // ====================================================

        return res.status(200).json({

            verified: true,

            blockchainVerified: true,

            tampered: false,

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

        console.error("");

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

            verified: false,

            blockchainVerified: false,

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
