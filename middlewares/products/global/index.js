const { getResponseObject } = require("../../../helpers/responses");

function validateIsPriceGreaterThanDiscount(price, discount, res, next) {
    if (Number(discount) > Number(price)) {
        return res.status(400).json(getResponseObject("Sorry, Please Send Valid Price And / Or Discount Value ( Must Be Price Greater Than Discount ) !!", true, {}));
    }
    next();
}

module.exports = {
    validateIsPriceGreaterThanDiscount
}