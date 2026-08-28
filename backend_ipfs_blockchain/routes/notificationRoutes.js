const express = require("express");

const router =
    express.Router();


const authenticateUser =
    require("../middleware/authMiddleware");


const {

    getNotifications,

    getUnreadCount,

    markNotificationAsRead,

    markAllNotificationsAsRead,

    deleteNotification

} =
    require("../controllers/notificationController");


// ============================================================
// Get All Notifications
// ============================================================

router.get(

    "/",

    authenticateUser,

    getNotifications

);


// ============================================================
// Get Unread Notification Count
// ============================================================

router.get(

    "/unread-count",

    authenticateUser,

    getUnreadCount

);


// ============================================================
// Mark All Notifications As Read
// ============================================================

router.patch(

    "/mark-all-read",

    authenticateUser,

    markAllNotificationsAsRead

);


// ============================================================
// Mark One Notification As Read
// ============================================================

router.patch(

    "/:id/read",

    authenticateUser,

    markNotificationAsRead

);


// ============================================================
// Delete Notification
// ============================================================

router.delete(

    "/:id",

    authenticateUser,

    deleteNotification

);


module.exports =
    router;