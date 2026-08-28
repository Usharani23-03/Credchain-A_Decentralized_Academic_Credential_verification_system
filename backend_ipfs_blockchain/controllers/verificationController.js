const prisma =
    require("../config/prisma");

const generateFileHash =
    require("../utils/hashGenerator");

const {
    verifyHashOnBlockchain
} = require(
    "../services/blockchainService"
);

const {
    notifyCertificateVerified
} = require(
    "../services/notificationService"
);

const fs =
    require("fs");


// ============================================================
// Create Verification Notifications
// ============================================================

const createVerificationNotifications =
    async (document) => {

        try {

            await notifyCertificateVerified(
                document
            );

        } catch (error) {

            console.error(

                "NOTIFICATION CREATION ERROR:",

                error

            );

        }

    };


// ============================================================
// Verify By File
// ============================================================

exports.verifyByFile =
    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({

                    verified:
                        false,

                    message:
                        "Please upload a certificate."

                });

            }


            const fileHash =
                generateFileHash(
                    req.file.path
                );


            if (
                fs.existsSync(
                    req.file.path
                )
            ) {

                fs.unlinkSync(
                    req.file.path
                );

            }


            const document =
                await prisma.document.findUnique({

                    where: {

                        fileHash

                    }

                });


            if (!document) {

                return res.status(404).json({

                    verified:
                        false,

                    message:
                        "Certificate not found in database."

                });

            }


            console.log(
                "Certificate ID:",
                document.blockchainTxId
            );

            console.log(
                "File Hash:",
                fileHash
            );


            const blockchain =
                await verifyHashOnBlockchain(

                    document.blockchainTxId,

                    fileHash

                );


            console.log(
                "Blockchain:",
                blockchain
            );


            if (!blockchain.exists) {

                return res.status(404).json({

                    verified:
                        false,

                    message:
                        "Certificate not found on blockchain."

                });

            }


            await createVerificationNotifications(
                document
            );


            return res.status(200).json({

                verified:
                    true,

                blockchainVerified:
                    true,

                document

            });

        } catch (error) {

            console.error(
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

                message:
                    "Internal Server Error"

            });

        }

    };


// ============================================================
// Verify By Hash
// ============================================================

exports.verifyByHash =
    async (req, res) => {

        try {

            const {
                fileHash
            } = req.body;


            if (!fileHash) {

                return res.status(400).json({

                    verified:
                        false,

                    message:
                        "File hash is required."

                });

            }


            const document =
                await prisma.document.findUnique({

                    where: {

                        fileHash

                    }

                });


            if (!document) {

                return res.status(404).json({

                    verified:
                        false,

                    message:
                        "Certificate not found."

                });

            }


            const blockchain =
                await verifyHashOnBlockchain(

                    document.blockchainTxId,

                    fileHash

                );


            if (!blockchain.exists) {

                return res.status(404).json({

                    verified:
                        false,

                    message:
                        "Certificate not found on blockchain."

                });

            }


            await createVerificationNotifications(
                document
            );


            return res.status(200).json({

                verified:
                    true,

                blockchainVerified:
                    true,

                document

            });

        } catch (error) {

            console.error(
                error
            );


            return res.status(500).json({

                verified:
                    false,

                message:
                    "Internal Server Error"

            });

        }

    };


// ============================================================
// Verify By QR
// ============================================================

exports.verifyByQR =
    async (req, res) => {

        try {

            const {
                certificateId
            } = req.body;


            if (!certificateId) {

                return res.status(400).json({

                    verified:
                        false,

                    message:
                        "Certificate ID is required."

                });

            }


            console.log(

                "QR Verification - Certificate ID:",

                certificateId

            );


            const document =
                await prisma.document.findFirst({

                    where: {

                        blockchainTxId:
                            certificateId

                    }

                });


            if (!document) {

                return res.status(404).json({

                    verified:
                        false,

                    message:
                        "Certificate not found in database."

                });

            }


            console.log(
                "Certificate found:",
                document.id
            );

            console.log(
                "Stored file hash:",
                document.fileHash
            );

            console.log(
                "Blockchain ID:",
                document.blockchainTxId
            );


            const blockchain =
                await verifyHashOnBlockchain(

                    document.blockchainTxId,

                    document.fileHash

                );


            console.log(
                "Blockchain verification:",
                blockchain
            );


            if (!blockchain.exists) {

                return res.status(404).json({

                    verified:
                        false,

                    blockchainVerified:
                        false,

                    message:
                        "Certificate could not be verified on blockchain."

                });

            }


            await createVerificationNotifications(
                document
            );


            return res.status(200).json({

                verified:
                    true,

                blockchainVerified:
                    true,

                verificationMethod:
                    "QR",

                message:
                    "Certificate authenticated successfully.",

                document

            });

        } catch (error) {

            console.error(
                "QR Verification Error:",
                error
            );


            return res.status(500).json({

                verified:
                    false,

                message:
                    "Internal Server Error"

            });

        }

    };