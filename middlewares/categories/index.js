const { getResponseObject } = require("../../helpers/responses");

function validateAges(minAge, maxAge, res, next) {
    if (minAge < 0) {
        return res.status(400).json(getResponseObject("Sorry Min Age Can't Be Less Than Zero !!", true, {}));
    }
    if (maxAge === minAge) {
        return res.status(400).json(getResponseObject("Sorry Max Age Can't Be Equal Min Age !!", true, {}));
    }
    next();
}

module.exports = {
    validateAges
}