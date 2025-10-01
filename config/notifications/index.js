const admin = require("firebase-admin");

let firebaseAdmin = null;

function initializeFirebase() {
    try {
        if (!admin.apps.length) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_API_CREDENTIALS);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            firebaseAdmin = admin;
            console.log("Firebase initialized");
        }
    }
    catch (err) {
        console.log(err);
    }
}

function getFirebaseAdmin() {
    return firebaseAdmin;
}

module.exports = { initializeFirebase, getFirebaseAdmin };