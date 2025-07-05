const { getResponseObject } = require("../../helpers/responses");

function validateAdvertismentType(type, res, nextFunc, errorMsg = "Sorry, Please Send Valid Advertimment Type !!") {
    if (!["panner", "elite"].includes(type)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

module.exports = {
    validateAdvertismentType,
}