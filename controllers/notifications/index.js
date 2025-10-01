const { responsesHelpers, translationHelpers } = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations } = translationHelpers;

const notificationsOPerationsManagmentFunctions = require("../../repositories/notifications");

const { getFirebaseAdmin } = require("../../config/notifications");

async function postRegisterToken(req, res) {
    try {
        res.json(await notificationsOPerationsManagmentFunctions.registerToken(req.data._id, req.body.token, req.query.language));
        const response = await getFirebaseAdmin().messaging().send({
            notification: {
                title: "New Notification",
                body: "You have a new message",
            },
            token: req.body.token
        });
        console.log("Successfully sent message:", response);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

module.exports = {
    postRegisterToken
}