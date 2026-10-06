const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();


const userRoutes =
    require("./routes/userRoutes");

const documentRoutes =
    require("./routes/documentRoutes");

const verificationRoutes =
    require("./routes/verificationRoutes");

const ipfsRoutes =
    require("./routes/ipfsRoutes");

const certificateRoutes =
    require("./routes/certificateRoutes");

const dashboardRoutes =
    require("./routes/dashboardRoutes");

const adminRoutes =
    require("./routes/adminRoutes");

const notificationRoutes =
    require("./routes/notificationRoutes");

const searchRoutes =
    require("./routes/searchRoutes");


const app =
    express();


const PORT =
    process.env.PORT || 5555;


// ============================================================
// Middleware
// ============================================================

app.use(

    cors({

        origin: [

            "http://localhost:3000",

            "http://127.0.0.1:3000",

            

        ],

        credentials:
            true

    })

);


app.use(
    express.json()
);


// ============================================================
// Static Files
// ============================================================

app.use(

    "/uploads",

    express.static(

        path.join(

            __dirname,

            "uploads"

        )

    )

);


// ============================================================
// Health Check
// ============================================================

app.get(

    "/",

    (req, res) => {

        res.status(200).send(
            "CredChain Backend is working!"
        );

    }

);


// ============================================================
// API Routes
// ============================================================

app.use(

    "/users",

    userRoutes

);


app.use(

    "/documents",

    documentRoutes

);


app.use(

    "/verify",

    verificationRoutes

);


app.use(

    "/ipfs",

    ipfsRoutes

);


app.use(

    "/certificates",

    certificateRoutes

);


app.use(

    "/dashboard",

    dashboardRoutes

);


app.use(

    "/admin",

    adminRoutes

);


// ============================================================
// Notification Routes
// ============================================================

app.use(

    "/notifications",

    notificationRoutes

);


// ============================================================
// Search Routes
// ============================================================

app.use(

    "/search",

    searchRoutes

);


// ============================================================
// 404 Handler
// ============================================================

app.use(

    (req, res) => {

        res.status(404).json({

            message:
                "Route not found",

            path:
                req.originalUrl

        });

    }

);


// ============================================================
// Global Error Handler
// ============================================================

app.use(

    (

        err,

        req,

        res,

        next

    ) => {

        console.error(

            "Global server error:",

            err

        );


        res.status(

            err.status || 500

        ).json({

            message:

                err.message ||

                "Internal server error"

        });

    }

);


// ============================================================
// Start Server
// ============================================================

const server =
    app.listen(

        PORT,

        "0.0.0.0",

        () => {

            console.log("");

            console.log(
                "========================================"
            );

            console.log(
                "       CREDCHAIN BACKEND SERVER"
            );

            console.log(
                "========================================"
            );

            console.log(
                `Server running on port ${PORT}`
            );

            console.log(
                `Local URL: http://localhost:${PORT}`
            );

            console.log(
                `Health: http://localhost:${PORT}/`
            );

            console.log(
                "========================================"
            );

            console.log("");

        }

    );


// ============================================================
// Server Error
// ============================================================

server.on(

    "error",

    (error) => {

        console.error(
            "SERVER ERROR:"
        );

        console.error(
            error
        );

    }

);


// ============================================================
// Graceful Shutdown
// ============================================================

process.on(

    "SIGINT",

    () => {

        console.log(
            "\nShutting down server..."
        );


        server.close(

            () => {

                console.log(
                    "Server closed."
                );

                process.exit(
                    0
                );

            }

        );

    }

);


process.on(

    "SIGTERM",

    () => {

        console.log(
            "\nSIGTERM received. Shutting down..."
        );


        server.close(

            () => {

                process.exit(
                    0
                );

            }

        );

    }

);


module.exports =
    app;