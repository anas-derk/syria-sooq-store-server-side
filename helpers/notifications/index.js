const { getFirebaseAdmin } = require("../../config/notifications");

async function sendNotification({ tokens, token, topic, title, body, data }) {
    try {
        const message = {
            notification: { title, body },
            data,
        };
        if (token) {
            // إرسال لتوكين واحد
            return getFirebaseAdmin().messaging().send({ ...message, token });
        }
        if (tokens && tokens.length > 0) {
            // إرسال لمجموعة توكنات (multicast)
            return getFirebaseAdmin().messaging().sendEachForMulticast({ ...message, tokens });
        }
        if (topic) {
            // إرسال لتوبيك
            return getFirebaseAdmin().messaging().send({ ...message, topic });
        }
        throw new Error("No Valid Target Specified (token/tokens/topic) !!");
    }
    catch (err) {
        throw err;
    }
}

module.exports = {
    sendNotification
}