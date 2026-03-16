const { responsesHelpers, translationHelpers, notificationsHelpers } = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations } = translationHelpers;

const notificationsOPerationsManagmentFunctions = require("../../repositories/notifications");

const { getFirebaseAdmin } = require("../../config/notifications");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "isRead") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function postRegisterToken(req, res) {
    try {
        const notificationToken = req.body.token;
        const result = await notificationsOPerationsManagmentFunctions.registerToken(req.data._id, notificationToken, req.query.language);
        const followedStores = result.data.followedStores;
        delete result.data.followedStores;
        res.json(result);
        const topics = followedStores
            .map(store => `store_${store._id.toString()}`);
        try {
            const results = await Promise.allSettled(
                topics.map(topic => {
                    return getFirebaseAdmin()
                        .messaging()
                        .subscribeToTopic([notificationToken], topic)
                        .then(() => ({ topic }))
                        .catch(error => ({ topic, error }));
                })
            );
            results.forEach(result => {
                const topic = result.value?.topic;
                if (result.status === "rejected" || result.value?.error) {
                    const err = result.value?.error || result.reason;
                    console.log(
                        `error in adding token to topic: ${topic}, user Id: ${req.data._id}, reason: ${err?.message ?? err}`
                    );
                } else {
                    console.log(`success in adding token to topic: ${topic}, user Id: ${req.data._id}`);
                }
            });
        }
        catch (err) {
            console.log(
                `error in adding token to store topics: ${topics}, user Id: ${req.data._id}, reason: ${err?.message ?? err}`
            );
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
    putMarkAllRead,
    getAllNotificationsInsideThePage
}