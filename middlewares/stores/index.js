const { getResponseObject } = require("../../helpers/responses");

const storeConstants = require("../../constants/stores");

function validateStoreCategory(category, res, nextFunc, errorMsg = "Sorry, Please Send Valid Store Category !!") {
    if (!storeConstants.STORE_CATEGORIES.includes(category)) {
        return res.status(400).json(getResponseObject(errorMsg, true, {}));
    }
    nextFunc();
}

function validateWorkingHours(workingHours, res, nextFunc) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    for (let i = 0; i < workingHours.length; i++) {
        if (!storeConstants.DAYS.includes(workingHours[i].day)) {
            return res.status(400).json(getResponseObject(`Sorry, Please Send Valid Day In Index: ${i} !!`, true, {}));
        }
        if (workingHours[i].openTime.time) {
            if (!timeRegex.test(workingHours[i].openTime.time)) {
                return res.status(400).json(getResponseObject(`Sorry, Please Send Valid Open Time In Day: ${i} !!`, true, {}));
            }
        }
        if (workingHours[i].closeTime.time) {
            if (!timeRegex.test(workingHours[i].closeTime.time)) {
                return res.status(400).json(getResponseObject(`Sorry, Please Send Valid Close Time In Day: ${i} !!`, true, {}));
            }
        }
        if (workingHours[i].openTime.period) {
            if (!storeConstants.PERIODS.includes(workingHours[i].openTime.period)) {
                return res.status(400).json(getResponseObject(`Sorry, Please Send Valid Open Time Period In Day: ${i} !!`, true, {}));
            }
        }
        if (workingHours[i].closeTime.period) {
            if (!storeConstants.PERIODS.includes(workingHours[i].closeTime.period)) {
                return res.status(400).json(getResponseObject(`Sorry, Please Send Valid Close Time Period In Day: ${i} !!`, true, {}));
            }
        }
    }
    nextFunc();
}

module.exports = {
    validateStoreCategory,
    validateWorkingHours,
}