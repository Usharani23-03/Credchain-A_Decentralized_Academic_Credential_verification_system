const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


// ============================================================
// Student Dashboard
// ============================================================

exports.studentDashboard = async (req, res) => {

    try {

        const userId = req.user.id;

        console.log("");
        console.log("=================================");
        console.log("STUDENT DASHBOARD");
        console.log("=================================");
        console.log("Student ID:", userId);
        console.log("=================================");


        const documents =
            await prisma.document.findMany({

                where: {
                    studentId: userId
                },

                orderBy: {
                    uploadedAt: "desc"
                }

            });


        const totalCertificates =
            documents.length;


        const verifiedCertificates =
            documents.filter(
                document =>
                    document.verificationStatus === "VERIFIED"
            ).length;


        const pendingCertificates =
            documents.filter(
                document =>
                    document.verificationStatus === "PENDING"
            ).length;


        console.log(
            "Certificates found:",
            totalCertificates
        );

        console.log("=================================");


        return res.status(200).json({

            totalCertificates,

            verifiedCertificates,

            pendingCertificates,

            documents

        });


    } catch (error) {

        console.error(
            "Student dashboard error:",
            error
        );

        return res.status(500).json({

            message:
                error.message

        });

    }

};



// ============================================================
// University Dashboard
// ============================================================

exports.universityDashboard = async (req, res) => {

    try {

        const universityId = req.user.id;


        const certificatesIssued =
            await prisma.document.count({

                where: {
                    userId: universityId
                }

            });


        const studentsRegistered =
            await prisma.user.count({

                where: {
                    role: "STUDENT"
                }

            });


        const pendingRequests =
            await prisma.document.count({

                where: {

                    userId: universityId,

                    verificationStatus:
                        "PENDING"

                }

            });


        return res.status(200).json({

            certificatesIssued,

            studentsRegistered,

            pendingRequests

        });


    } catch (error) {

        console.error(
            "University dashboard error:",
            error
        );

        return res.status(500).json({

            message:
                error.message

        });

    }

};



// ============================================================
// Employer Dashboard
// ============================================================

exports.employerDashboard = async (req, res) => {

    try {

        const totalVerifications =
            await prisma.document.count({

                where: {

                    verificationStatus: {
                        not: "PENDING"
                    }

                }

            });


        const successfulVerifications =
            await prisma.document.count({

                where: {

                    verificationStatus:
                        "VERIFIED"

                }

            });


        const failedVerifications =
            await prisma.document.count({

                where: {

                    verificationStatus:
                        "REJECTED"

                }

            });


        return res.status(200).json({

            totalVerifications,

            successfulVerifications,

            failedVerifications

        });


    } catch (error) {

        console.error(
            "Employer dashboard error:",
            error
        );

        return res.status(500).json({

            message:
                error.message

        });

    }

};



// ============================================================
// Admin Dashboard
// ============================================================

exports.adminDashboard = async (req, res) => {

    try {

        const totalUsers =
            await prisma.user.count();


        const totalCertificates =
            await prisma.document.count();


        const universities =
            await prisma.user.count({

                where: {
                    role: "UNIVERSITY"
                }

            });


        return res.status(200).json({

            totalUsers,

            totalCertificates,

            universities

        });


    } catch (error) {

        console.error(
            "Admin dashboard error:",
            error
        );

        return res.status(500).json({

            message:
                error.message

        });

    }

};