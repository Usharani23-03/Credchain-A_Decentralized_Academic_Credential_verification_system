const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


// Student Dashboard
exports.studentDashboard = async (req, res) => {
    try {

        const userId = req.user.id;


        const totalCertificates = await prisma.document.count({
            where: {
                userId: userId
            }
        });


        const verifiedCertificates = await prisma.document.count({
            where: {
                userId: userId,
                verificationStatus: "VERIFIED"
            }
        });


        const pendingCertificates = await prisma.document.count({
            where: {
                userId: userId,
                verificationStatus: "PENDING"
            }
        });


        res.json({
            totalCertificates,
            verifiedCertificates,
            pendingCertificates
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};




// University Dashboard
exports.universityDashboard = async (req, res) => {
    try {


        const certificatesIssued =
            await prisma.document.count();


        const studentsRegistered =
            await prisma.user.count({
                where: {
                    role: "STUDENT"
                }
            });


        const pendingRequests =
            await prisma.document.count({
                where:{
                    verificationStatus:"PENDING"
                }
            });



        res.json({

            certificatesIssued,
            studentsRegistered,
            pendingRequests

        });


    } catch(error){

        res.status(500).json({
            message:error.message
        });

    }
};




// Employer Dashboard
exports.employerDashboard = async(req,res)=>{

    try{


        const totalVerifications =
            await prisma.document.count({
                where:{
                    verificationStatus:{
                        not:"PENDING"
                    }
                }
            });



        const successfulVerifications =
            await prisma.document.count({
                where:{
                    verificationStatus:"VERIFIED"
                }
            });



        const failedVerifications =
            await prisma.document.count({
                where:{
                    verificationStatus:"REJECTED"
                }
            });



        res.json({

            totalVerifications,
            successfulVerifications,
            failedVerifications

        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// Admin Dashboard
exports.adminDashboard = async(req,res)=>{

    try{


        const totalUsers =
            await prisma.user.count();


        const totalCertificates =
            await prisma.document.count();



        const universities =
            await prisma.user.count({
                where:{
                    role:"UNIVERSITY"
                }
            });



        res.json({

            totalUsers,
            totalCertificates,
            universities

        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};