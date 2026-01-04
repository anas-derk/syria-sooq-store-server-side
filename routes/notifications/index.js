const notificationsRouter = require("express").Router();

const notificationsController = require("../../controllers/notifications");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../helpers/validate");

const {
    authMiddlewares,
    numbersMiddlewares,
} = require("../../middlewares");

const {
    validateJWT,
} = authMiddlewares;

const {
    validateNumbersIsGreaterThanZero,
    validateNumbersIsNotFloat,
} = numbersMiddlewares;

notificationsRouter.post("/register-token",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Token", fieldValue: req.body.token, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    notificationsController.postRegisterToken
);

notificationsRouter.post("/send",
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Token", fieldValue: req.body.token, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    notificationsController.postSendNotification
);

notificationsRouter.get("/all-notifications-inside-the-page",
    validateJWT,
    (req, res, next) => {
        const { pageNumber, pageSize } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Page Number", fieldValue: Number(pageNumber), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "Page Size", fieldValue: Number(pageSize), dataTypes: ["number"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateNumbersIsGreaterThanZero([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Greater Than Zero ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Greater Than Zero ) !!"]),
    (req, res, next) => validateNumbersIsNotFloat([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Not Float ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Not Float ) !!"]),
    notificationsController.getAllNotificationsInsideThePage
);

notificationsRouter.put("/mark-all-read", validateJWT, notificationsController.putMarkAllRead);

module.exports = notificationsRouter;