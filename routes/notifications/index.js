const notificationsRouter = require("express").Router();

const notificationsController = require("../../controllers/notifications");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../helpers/validate");

const { validateJWT } = require("../../middlewares/auth");

const { validateNotificationsToken } = require("../../middlewares/notifications");

notificationsRouter.post("/register-token",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Token", fieldValue: req.body.token, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateNotificationsToken(req.body.token, res, next),
    notificationsController.postRegisterToken
);

module.exports = notificationsRouter;