// Import User + Notification Model Object

const { userModel, notificationModel } = require("../../models");

const { getSuitableTranslations } = require("../../helpers/translation");

// Define Register Token Function

async function registerToken(userId, token, language) {
    try {
        const user = await userModel.findById(userId).populate("followedStores", { _id: 1 });
        if (!user) {
            return {
                msg: getSuitableTranslations("Sorry, Can't Register New Token Because This User Is Not Exist !!", language),
                error: true,
                data: {},
            }
        }
        await userModel.updateOne({ _id: userId }, { notificationsToken: token });
        return {
            msg: getSuitableTranslations("Register New Token Process Has Been Successfuly !!", language),
            error: false,
            data: {
                followedStores: user.followedStores
            },
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function saveNotifcation(userId, title, body, data, language) {
    try {
        const notificationInstance = new notificationModel({ userId, title, body, data });
        const notification = await notificationInstance.save();
        return {
            msg: getSuitableTranslations("Save New Notification Process Has Been Successfuly !!", language),
            error: false,
            data: notification,
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllNotificationsInsideThePage(authorizationId, pageNumber, pageSize, filters, language) {
    try {
        const user = await userModel.findById(authorizationId);
        if (user) {
            filters.userId = authorizationId;
            return {
                msg: getSuitableTranslations("Get All Notifications Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
                error: false,
                data: {
                    notifications: await notificationModel.find(filters).sort({ createdAt: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize),
                    notificationsCount: await notificationModel.countDocuments(filters),
                    unreadNotificationsCount: await notificationModel.countDocuments({ ...filters, isRead: false }),
                },
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function markAllRead(userId, language) {
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return {
                msg: getSuitableTranslations("Sorry, Can't Mark All Notifications As Read Because This User Is Not Exist !!", language),
                error: true,
                data: {},
            }
        }
        await notificationModel.updateMany({ userId, isRead: false }, { $set: { isRead: true } });
        return {
            msg: getSuitableTranslations("Mark All Notifications As Read For This User Process Has Been Successfully !!", language),
            error: false,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    registerToken,
    saveNotifcation,
    markAllRead,
    getAllNotificationsInsideThePage,
}