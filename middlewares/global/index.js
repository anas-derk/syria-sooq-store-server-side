const { getResponseObject } = require("../../helpers/responses");
const { isValidLanguage } = require("../../validators/global/language");

function validateLanguage(language, res, nextFunc, errorMsg = "Sorry, Please Send Valid Language !!") {
    if (!isValidLanguage(language)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

module.exports = {
    validateLanguage,
}