const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================

exports.registerUser = async (req, res) => {

    try {

        let { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Name, email, password and role are required."
            });
        }

        name = name.trim();
        email = email.trim().toLowerCase();

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long."
            });
        }

        const allowedRoles = [
            "STUDENT",
            "UNIVERSITY",
            "EMPLOYER",
            "ADMIN"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role."
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            }
        });

        // Generate JWT immediately after registration
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        const { password: _, ...userWithoutPassword } = user;

        return res.status(201).json({
            message: "User registered successfully.",
            token,
            user: userWithoutPassword
        });

    } catch (error) {

        console.error("REGISTRATION ERROR:", error);

        return res.status(500).json({
            message: "Internal Server Error."
        });

    }

};


// ================= LOGIN =================

exports.loginUser = async (req, res) => {

    try {

        let { email, password } = req.body;

        console.log("LOGIN REQUEST BODY:", req.body);

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        email = email.trim().toLowerCase();

        console.log("Searching email:", email);

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        console.log("USER FOUND:", user);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        console.log("Stored password hash:", user.password);

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        console.log("PASSWORD MATCH:", validPassword);

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        const { password: __, ...userWithoutPassword } = user;

        return res.status(200).json({
            message: "Login successful.",
            token,
            user: userWithoutPassword
        });

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            message: "Internal Server Error."
        });

    }

};


// ================= PROFILE =================

exports.getProfile = async (req, res) => {

    try {

        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        return res.status(200).json({
            message: "Profile fetched successfully.",
            user
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error."
        });

    }

};


// ================= CHANGE PASSWORD =================

exports.changePassword = async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;

        // --------------------------------------------------
        // Validate input
        // --------------------------------------------------

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message:
                    "Current password and new password are required."
            });
        }

        // --------------------------------------------------
        // Validate new password length
        // --------------------------------------------------

        if (newPassword.length < 6) {
            return res.status(400).json({
                message:
                    "New password must be at least 6 characters long."
            });
        }

        // --------------------------------------------------
        // Prevent same password
        // --------------------------------------------------

        if (currentPassword === newPassword) {
            return res.status(400).json({
                message:
                    "New password must be different from the current password."
            });
        }

        // --------------------------------------------------
        // Get logged-in user
        // --------------------------------------------------

        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        // --------------------------------------------------
        // Verify current password
        // --------------------------------------------------

        const validPassword = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "Current password is incorrect."
            });
        }

        // --------------------------------------------------
        // Hash new password
        // --------------------------------------------------

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        // --------------------------------------------------
        // Update password
        // --------------------------------------------------

        await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                password: hashedPassword
            }
        });

        // --------------------------------------------------
        // Success
        // --------------------------------------------------

        return res.status(200).json({
            message: "Password changed successfully."
        });

    } catch (error) {

        console.error(
            "CHANGE PASSWORD ERROR:",
            error
        );

        return res.status(500).json({
            message: "Internal Server Error."
        });

    }

};