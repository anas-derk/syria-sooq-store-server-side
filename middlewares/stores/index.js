const { getResponseObject } = require("../../helpers/responses");

const storeConstants = require("../../constants/stores");

function validateStoreCategory(category, res, nextFunc, errorMsg = "Sorry, Please Send Valid Store Category !!") {
    if (!storeConstants.STORE_CATEGORIES.includes(category)) {
        return res.status(400).json(getResponseObject(errorMsg, true, {}));
    }
    nextFunc();
}

module.exports = {
    validateStoreCategory,
}