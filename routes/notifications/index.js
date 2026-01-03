const notificationsRouter = require("express").Router();

const notificationsController = require("../../controllers/notifications");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../helpers/validate");

const { validateJWT } = require("../../middlewares/auth");

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

module.exports = notificationsRouter;