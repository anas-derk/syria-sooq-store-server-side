const { responsesHelpers, translationHelpers, notificationsHelpers } = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations } = translationHelpers;

const notificationsOPerationsManagmentFunctions = require("../../repositories/notifications");

const { sendNotification } = notificationsHelpers;

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "isRead") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function postRegisterToken(req, res) {
    try {
        res.json(await notificationsOPerationsManagmentFunctions.registerToken(req.data._id, req.body.token, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postSendNotification(req, res) {
    try {
        const token = req.body.token;
        const notification = {
            title: "Adding New Product",
            body: "Add A New Product In A Store You Follow",
            data: {
                productId: "6820966dc26165b87ef753d6",
                name: "IPhone 15 Pro Max",
                imagePath: "assets/images/products/0.3542799787759132_1753618544900__iphone_15_pro_max.webp",
                storeName: "Syria Sooq"
            },
        };
        await notificationsOPerationsManagmentFunctions.saveNotifcation("68cc1ab3266b31dfa6772530", notification.title, notification.body, notification.data);
        res.json({
            msg: getSuitableTranslations("Send Notification To Token Process Has Been Successfully !!", req.query.language),
            error: false,
            data: {}
        });
        try {
            await sendNotification({
                ...notification,
                token
            });
            console.log(`success in send Notification to token: ${token}`);
        }
        catch (err) {
            console.log(`error in send Notification to token: ${token}, reason: ${err?.message ?? err}`);
        }
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllNotificationsInsideThePage(req, res) {
    try {
        const filters = req.query;
        res.json(await notificationsOPerationsManagmentFunctions.getAllNotificationsInsideThePage(req.data._id, filters.pageNumber, filters.pageSize, getFiltersObject(filters), filters.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putMarkAllRead(req, res) {
    try {
        res.json(await notificationsOPerationsManagmentFunctions.markAllRead(req.data._id, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

module.exports = {
    postRegisterToken,
    postSendNotification,
    putMarkAllRead,
    getAllNotificationsInsideThePage
}