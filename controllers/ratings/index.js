const { responsesHelpers, translationHelpers } = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations } = translationHelpers;

const ratingOPerationsManagmentFunctions = require("../../repositories/ratings");

async function postSelectRating(req, res) {
    try {
        res.json(await ratingOPerationsManagmentFunctions.selectRating(req.data._id, req.body, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getRatingByUserId(req, res) {
    try {
        const { type, language } = req.query;
        res.json(await ratingOPerationsManagmentFunctions.getRatingByUserId(req.data._id, req.params.id, type, language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

module.exports = {
    postSelectRating,
    getRatingByUserId
}