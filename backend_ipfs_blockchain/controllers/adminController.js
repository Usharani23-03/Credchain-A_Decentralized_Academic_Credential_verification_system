const prisma = require("../config/prisma");

exports.getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();

    const totalCertificates = await prisma.document.count();

    const universities = await prisma.user.count({
      where: {
        role: "UNIVERSITY",
      },
    });

    return res.status(200).json({
      totalUsers,
      totalCertificates,
      universities,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
exports.getAllUsers = async (req, res) => {

    try {

        const users = await prisma.user.findMany({

            select: {

                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true

            },

            orderBy: {

                createdAt: "desc"

            }

        });

        return res.status(200).json({

            users

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};
exports.getAllCertificates = async (req, res) => {

    try {

        const certificates = await prisma.document.findMany({

            include: {

                user: {

                    select: {

                        name: true,
                        email: true,
                        role: true

                    }

                }

            },

            orderBy: {

                uploadedAt: "desc"

            }

        });

        return res.status(200).json({

            certificates

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};
exports.getReports = async (req, res) => {
  try {

    const totalUsers = await prisma.user.count();

    const totalCertificates = await prisma.document.count();

    const verifiedCertificates = await prisma.document.count({
      where: {
        verificationStatus: "VERIFIED",
      },
    });

    const pendingCertificates = await prisma.document.count({
      where: {
        verificationStatus: "PENDING",
      },
    });

    const rejectedCertificates = await prisma.document.count({
      where: {
        verificationStatus: "REJECTED",
      },
    });

    const universities = await prisma.user.count({
      where: {
        role: "UNIVERSITY",
      },
    });

    const certificateTypes = await prisma.document.groupBy({
      by: ["certificateType"],
      _count: {
        certificateType: true,
      },
    });

    const recentCertificates = await prisma.document.findMany({
      take: 5,
      orderBy: {
        uploadedAt: "desc",
      },
      select: {
        title: true,
        certificateType: true,
        verificationStatus: true,
        uploadedAt: true,
      },
    });

    return res.status(200).json({
      totalUsers,
      totalCertificates,
      verifiedCertificates,
      pendingCertificates,
      rejectedCertificates,
      universities,
      certificateTypes,
      recentCertificates,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });

  }
};