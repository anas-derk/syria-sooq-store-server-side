const { getResponseObject } = require("../../helpers/responses");
const { ADVERTISMENT_TYPE } = require("../../constants/ads");

function validateAdvertismentType(type, res, nextFunc, errorMsg = "Sorry, Please Send Valid Advertimment Type !!") {
    if (!ADVERTISMENT_TYPE.includes(type)) {
        res.status(400).json(getResponseObject(errorMsg, true, {}));
        return;
    }
    nextFunc();
}

module.exports = {
    validateAdvertismentType,
}