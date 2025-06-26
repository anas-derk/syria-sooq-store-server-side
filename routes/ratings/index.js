const ratingsRouter = require("express").Router();

const ratingsController = require("../../controllers/ratings.controller");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../global/functions");

const { validateJWT } = require("../../middlewares/global.middlewares");

const { validateRatingType, validateRating } = require("../../middlewares/ratings.midddlewares");

ratingsRouter.post("/select-rating",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Id", fieldValue: req.body.id, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Type", fieldValue: req.body.type, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Rating", fieldValue: req.body.rating, dataTypes: ["number"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateRatingType(req.body.type, res, next),
    (req, res, next) => validateRating(req.body.rating, res, next),
    ratingsController.postSelectProductRating
);

ratingsRouter.get("/rating-by-user-id/:id",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Id", fieldValue: req.params.id, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Type", fieldValue: req.query.type, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateRatingType(req.query.type, res, next),
    ratingsController.getRatingByUserId
);

module.exports = ratingsRouter;