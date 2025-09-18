const { getResponseObject } = require("../../helpers/responses");

const storeConstants = require("../../constants/stores");

function validateStoreCategory(category, res, nextFunc, errorMsg = "Sorry, Please Send Valid Store Category !!") {
    if (!storeConstants.STORE_CATEGORIES.includes(category)) {
        return res.status(400).json(getResponseObject(errorMsg, true, {}));
    }
    nextFunc();
}

function validateWorkingHours(workingHours, res, nextFunc, errorMsg = "Sorry, Please Send Valid Working Hours !!") {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    for (let i = 0; i < workingHours.length; i++) {
        if (!timeRegex.test(workingHours[i].openTime)) {
            return res.status(400).json(getResponseObject(`Sorry, Please Send Valid Open Time In Day: ${i} !!`, true, {}));
        }
        if (!timeRegex.test(workingHours[i].closeTime)) {
            return res.status(400).json(getResponseObject(`Sorry, Please Send Valid Close Time In Day: ${i} !!`, true, {}));
        }
        const [openH, openM] = workingHours[i].openTime.split(":").map(Number);
        const [closeH, closeM] = workingHours[i].closeTime.split(":").map(Number);
        const openMinutes = openH * 60 + openM;
        const closeMinutes = closeH * 60 + closeM;
        if (openMinutes > closeMinutes) {
            return res.status(400).json(getResponseObject(errorMsg, true, {}));
        }
    }
    nextFunc();
}

module.exports = {
    validateStoreCategory,
    validateWorkingHours,
}