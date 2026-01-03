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

async function postSendNotification(req, res) {
    try {
        const token = req.body.token;
        res.json({
            msg: getSuitableTranslations("Send Notification To Token Process Has Been Successfully !!", req.query.language),
            error: false,
            data: {}
        });
        try {
            await sendNotification({
                title: "Testing Send Notification",
                body: "Testing Send Notification To Token",
                data: {
                    name: "Anas Derk"
                },
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

module.exports = {
    postRegisterToken,
    postSendNotification
}