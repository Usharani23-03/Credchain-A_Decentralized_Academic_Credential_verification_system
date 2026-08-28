const prisma = require("../config/prisma");


// ============================================================
// Get All My Notifications
// ============================================================

exports.getNotifications =
    async (req, res) => {

        try {

            const notifications =
                await prisma.notification.findMany({

                    where: {

                        userId:
                            req.user.id

                    },

                    orderBy: {

                        createdAt:
                            "desc"

                    },

                    take:
                        50

                });


            const unreadCount =
                notifications.filter(

                    notification =>
                        !notification.isRead

                ).length;


            return res.status(200).json({

                notifications,

                unreadCount

            });

        } catch (error) {

            console.error(

                "GET NOTIFICATIONS ERROR:",

                error

            );


            return res.status(500).json({

                message:
                    "Failed to fetch notifications."

            });

        }

    };


// ============================================================
// Get Unread Notification Count
// ============================================================

exports.getUnreadCount =
    async (req, res) => {

        try {

            const unreadCount =
                await prisma.notification.count({

                    where: {

                        userId:
                            req.user.id,

                        isRead:
                            false

                    }

                });


            return res.status(200).json({

                unreadCount

            });

        } catch (error) {

            console.error(

                "GET UNREAD NOTIFICATION COUNT ERROR:",

                error

            );


            return res.status(500).json({

                message:
                    "Failed to fetch unread notification count."

            });

        }

    };


// ============================================================
// Mark One Notification As Read
// ============================================================

exports.markNotificationAsRead =
    async (req, res) => {

        try {

            const notificationId =
                Number(
                    req.params.id
                );


            if (
                Number.isNaN(
                    notificationId
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid notification ID."

                });

            }


            const notification =
                await prisma.notification.findUnique({

                    where: {

                        id:
                            notificationId

                    }

                });


            if (!notification) {

                return res.status(404).json({

                    message:
                        "Notification not found."

                });

            }


            if (
                notification.userId !==
                req.user.id
            ) {

                return res.status(403).json({

                    message:
                        "Access denied."

                });

            }


            const updatedNotification =
                await prisma.notification.update({

                    where: {

                        id:
                            notificationId

                    },

                    data: {

                        isRead:
                            true

                    }

                });


            return res.status(200).json({

                message:
                    "Notification marked as read.",

                notification:
                    updatedNotification

            });

        } catch (error) {

            console.error(

                "MARK NOTIFICATION READ ERROR:",

                error

            );


            return res.status(500).json({

                message:
                    "Failed to update notification."

            });

        }

    };


// ============================================================
// Mark All Notifications As Read
// ============================================================

exports.markAllNotificationsAsRead =
    async (req, res) => {

        try {

            const result =
                await prisma.notification.updateMany({

                    where: {

                        userId:
                            req.user.id,

                        isRead:
                            false

                    },

                    data: {

                        isRead:
                            true

                    }

                });


            return res.status(200).json({

                message:
                    "All notifications marked as read.",

                updatedCount:
                    result.count

            });

        } catch (error) {

            console.error(

                "MARK ALL NOTIFICATIONS READ ERROR:",

                error

            );


            return res.status(500).json({

                message:
                    "Failed to update notifications."

            });

        }

    };


// ============================================================
// Delete Notification
// ============================================================

exports.deleteNotification =
    async (req, res) => {

        try {

            const notificationId =
                Number(
                    req.params.id
                );


            if (
                Number.isNaN(
                    notificationId
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid notification ID."

                });

            }


            const notification =
                await prisma.notification.findUnique({

                    where: {

                        id:
                            notificationId

                    }

                });


            if (!notification) {

                return res.status(404).json({

                    message:
                        "Notification not found."

                });

            }


            if (
                notification.userId !==
                req.user.id
            ) {

                return res.status(403).json({

                    message:
                        "Access denied."

                });

            }


            await prisma.notification.delete({

                where: {

                    id:
                        notificationId

                }

            });


            return res.status(200).json({

                message:
                    "Notification deleted."

            });

        } catch (error) {

            console.error(

                "DELETE NOTIFICATION ERROR:",

                error

            );


            return res.status(500).json({

                message:
                    "Failed to delete notification."

            });

        }

    };