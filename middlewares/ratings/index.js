const { getResponseObject } = require("../../helpers/responses");
const ratingsConstants = require("../../constants/ratings");

function validateRatingType(type, res, nextFunc) {
    if (!ratingsConstants.RATING_TYPE.includes(type)) {
        res.status(400).json(getResponseObject("Sorry, Please Send Valid Rating Type !!", true, {}));
        return;
    }
    nextFunc();
}

function validateRating(rating, res, nextFunc) {
    if (!ratingsConstants.RATING.includes(rating)) {
        res.status(400).json(getResponseObject("Sorry, Please Send Valid Rating !!", true, {}));
        return;
    }
    nextFunc();
}

module.exports = {
    validateRatingType,
    validateRating,
}