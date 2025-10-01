const { responsesHelpers, translationHelpers, notificationsHelpers } = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations } = translationHelpers;

const notificationsOPerationsManagmentFunctions = require("../../repositories/notifications");

const { sendNotification } = notificationsHelpers;

async function postRegisterToken(req, res) {
    try {
        res.json(await notificationsOPerationsManagmentFunctions.registerToken(req.data._id, req.body.token, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

module.exports = {
    postRegisterToken
}