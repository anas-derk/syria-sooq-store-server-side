const { getResponseObject, getSuitableTranslations } = require("../global/functions");

// const globalPasswordsManagmentFunctions = require("../models/global_password.model");

async function putChangeBussinessEmailPassword(req, res) {
    try {
        const { email, password, newPassword, language } = req.query;
        const result = await globalPasswordsManagmentFunctions.changeBussinessEmailPassword(req.data._id, email.toLowerCase(), password, newPassword, language);
        if (result.error) {
            if (result.msg !== "Sorry, Email Or Password Incorrect !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

module.exports = {
    putChangeBussinessEmailPassword,
}