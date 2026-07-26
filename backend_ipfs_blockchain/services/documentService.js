const prisma = require("../config/prisma");

exports.getDocumentByHash = async (fileHash) => {

    return await prisma.document.findUnique({
        where: {
            fileHash
        }
    });

};

exports.getDocumentById = async (id) => {

    return await prisma.document.findUnique({
        where: {
            id
        }
    });

};

exports.getUserDocuments = async (userId) => {

    return await prisma.document.findMany({

        where: {
            userId
        },

        orderBy: {
            uploadedAt: "desc"
        }

    });

};