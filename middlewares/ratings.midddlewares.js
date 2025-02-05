const { getResponseObject } = require("../global/functions");

function validateRatingType(type, res, nextFunc) {
    if (![
        "product",
        "store"
    ].includes(type)) {
        res.status(400).json(getResponseObject("Sorry, Please Send Valid Rating Type !!", true, {}));
        return;
    }
    nextFunc();
}

function validateRating(rating, res, nextFunc) {
    if (![1, 2, 3, 4, 5].includes(rating)) {
        res.status(400).json(getResponseObject("Sorry, Please Send Valid Rating !!", true, {}));
        return;
    }
    nextFunc();
}

module.exports = {
    validateRatingType,
    validateRating,
}