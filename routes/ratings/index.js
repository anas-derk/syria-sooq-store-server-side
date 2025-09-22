const ratingsRouter = require("express").Router();

const ratingsController = require("../../controllers/ratings");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../helpers/validate");

const {
    authMiddlewares,
    ratingsMiddlewares,
} = require("../../middlewares");

const {
    validateJWT,
} = authMiddlewares;

const {
    validateRatingType,
    validateRating,
} = ratingsMiddlewares;

ratingsRouter.post("/select-rating",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Id", fieldValue: req.body.id, dataTypes: ["ObjectId"], isRequiredValue: req.body.type !== "app" },
            { fieldName: "Type", fieldValue: req.body.type, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Rating", fieldValue: req.body.rating, dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "Notes", fieldValue: req.body.notes, dataTypes: ["string"], isRequiredValue: false },
        ], res, next);
    },
    (req, res, next) => validateRatingType(req.body.type, res, next),
    (req, res, next) => validateRating(req.body.rating, res, next),
    ratingsController.postSelectRating
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