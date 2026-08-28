const prisma = require("../config/prisma");

// ============================================================
// Create Notification
// ============================================================

const createNotification = async ({
    userId,
    title,
    message,
    type = null
}) => {

    try {

        if (!userId) {
            return null;
        }

        const notification =
            await prisma.notification.create({

                data: {

                    userId,
                    title,
                    message,
                    type

                }

            });

        return notification;

    } catch (error) {

        console.error(
            "CREATE NOTIFICATION ERROR:",
            error
        );

        return null;

    }

};


// ============================================================
// Certificate Issued Notification
// ============================================================

const notifyCertificateIssued = async (
    studentId,
    document
) => {

    return await createNotification({

        userId:
            studentId,

        title:
            "Certificate Issued",

        message:
            `A new certificate "${document.title}" has been issued to you by ${document.issuedBy}.`,

        type:
            "CERTIFICATE_ISSUED"

    });

};


// ============================================================
// Certificate Verification Notification
// ============================================================

const notifyCertificateVerified = async (
    document
) => {

    try {

        const notifications = [];

        // Notify the student who owns the certificate

        if (document.studentId) {

            notifications.push(

                createNotification({

                    userId:
                        document.studentId,

                    title:
                        "Certificate Verified",

                    message:
                        `Your certificate "${document.title}" has been successfully verified.`,

                    type:
                        "CERTIFICATE_VERIFIED"

                })

            );

        }


        // Notify the university that issued the certificate

        if (
            document.userId &&
            document.userId !== document.studentId
        ) {

            notifications.push(

                createNotification({

                    userId:
                        document.userId,

                    title:
                        "Certificate Verification Complete",

                    message:
                        `The certificate "${document.title}" issued by your institution has been successfully verified.`,

                    type:
                        "CERTIFICATE_VERIFIED"

                })

            );

        }


        await Promise.all(
            notifications
        );

    } catch (error) {

        console.error(
            "VERIFICATION NOTIFICATION ERROR:",
            error
        );

    }

};


module.exports = {

    createNotification,

    notifyCertificateIssued,

    notifyCertificateVerified

};