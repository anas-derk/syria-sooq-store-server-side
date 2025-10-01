const { getResponseObject } = require("../../helpers/responses");

const { getFirebaseAdmin } = require("../../config/notifications");

async function validateNotificationsToken(token, res, nextFunc, errorMsg = "Sorry, Please Send Valid Valid Token !!") {
    try {
        // await getFirebaseAdmin().auth().verifyIdToken(token);
        nextFunc();
    }
    catch (err) {
        console.log(err);
        res.status(400).json(getResponseObject(errorMsg, true, {}));
    }
}

module.exports = {
    validateNotificationsToken,
}