const prisma = require("../config/prisma");


// ============================================================
// Global Search
// ============================================================

exports.globalSearch = async (req, res) => {

    try {

        const searchQuery =
            req.query.q
                ? req.query.q.trim()
                : "";


        if (!searchQuery) {

            return res.status(400).json({

                message:
                    "Please provide a search query."

            });

        }


        const userId =
            req.user.id;


        const userRole =
            req.user.role;


        const containsFilter = {

            contains:
                searchQuery,

            mode:
                "insensitive"

        };


        let documents = [];


        // ====================================================
        // STUDENT SEARCH
        // Search only certificates belonging to the student
        // ====================================================

        if (
            userRole ===
            "STUDENT"
        ) {

            documents =
                await prisma.document.findMany({

                    where: {

                        studentId:
                            userId,

                        OR: [

                            {
                                title:
                                    containsFilter
                            },

                            {
                                certificateId:
                                    containsFilter
                            },

                            {
                                certificateType:
                                    containsFilter
                            },

                            {
                                issuedBy:
                                    containsFilter
                            }

                        ]

                    },

                    orderBy: {

                        uploadedAt:
                            "desc"

                    },

                    include: {

                        user: {

                            select: {

                                id: true,

                                name: true,

                                email: true

                            }

                        }

                    },

                    take:
                        50

                });

        }


        // ====================================================
        // UNIVERSITY SEARCH
        // Search only certificates issued by this university
        // ====================================================

        else if (
            userRole ===
            "UNIVERSITY"
        ) {

            documents =
                await prisma.document.findMany({

                    where: {

                        userId:
                            userId,

                        OR: [

                            {
                                title:
                                    containsFilter
                            },

                            {
                                certificateId:
                                    containsFilter
                            },

                            {
                                certificateType:
                                    containsFilter
                            },

                            {
                                issuedBy:
                                    containsFilter
                            },

                            {

                                student: {

                                    name:
                                        containsFilter

                                }

                            },

                            {

                                student: {

                                    email:
                                        containsFilter

                                }

                            }

                        ]

                    },

                    orderBy: {

                        uploadedAt:
                            "desc"

                    },

                    include: {

                        student: {

                            select: {

                                id: true,

                                name: true,

                                email: true

                            }

                        }

                    },

                    take:
                        50

                });

        }


        // ====================================================
        // EMPLOYER SEARCH
        // Search certificates available for verification/search
        // ====================================================

        else if (
            userRole ===
            "EMPLOYER"
        ) {

            documents =
                await prisma.document.findMany({

                    where: {

                        OR: [

                            {
                                title:
                                    containsFilter
                            },

                            {
                                certificateId:
                                    containsFilter
                            },

                            {
                                certificateType:
                                    containsFilter
                            },

                            {
                                issuedBy:
                                    containsFilter
                            },

                            {

                                student: {

                                    name:
                                        containsFilter

                                }

                            }

                        ]

                    },

                    orderBy: {

                        uploadedAt:
                            "desc"

                    },

                    include: {

                        student: {

                            select: {

                                id: true,

                                name: true

                            }

                        },

                        user: {

                            select: {

                                id: true,

                                name: true

                            }

                        }

                    },

                    take:
                        50

                });

        }


        // ====================================================
        // ADMIN SEARCH
        // Search all certificates
        // ====================================================

        else if (
            userRole ===
            "ADMIN"
        ) {

            documents =
                await prisma.document.findMany({

                    where: {

                        OR: [

                            {
                                title:
                                    containsFilter
                            },

                            {
                                certificateId:
                                    containsFilter
                            },

                            {
                                certificateType:
                                    containsFilter
                            },

                            {
                                issuedBy:
                                    containsFilter
                            },

                            {

                                student: {

                                    name:
                                        containsFilter

                                }

                            },

                            {

                                student: {

                                    email:
                                        containsFilter

                                }

                            },

                            {

                                user: {

                                    name:
                                        containsFilter

                                }

                            },

                            {

                                user: {

                                    email:
                                        containsFilter

                                }

                            }

                        ]

                    },

                    orderBy: {

                        uploadedAt:
                            "desc"

                    },

                    include: {

                        student: {

                            select: {

                                id: true,

                                name: true,

                                email: true

                            }

                        },

                        user: {

                            select: {

                                id: true,

                                name: true,

                                email: true,

                                role: true

                            }

                        }

                    },

                    take:
                        50

                });

        }


        // ====================================================
        // Response
        // ====================================================

        return res.status(200).json({

            query:
                searchQuery,

            total:
                documents.length,

            documents

        });


    } catch (error) {

        console.error(
            "GLOBAL SEARCH ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to perform search.",

            error:
                error.message

        });

    }

};