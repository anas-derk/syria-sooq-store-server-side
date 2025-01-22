const usersRouter = require("express").Router();

const usersController = require("../controllers/users.controller");

const { validateIsExistValueForFieldsAndDataTypes, isEmail, isValidMobilePhone, getResponseObject } = require("../global/functions");

const { validateJWT, validateEmail, validatePassword, validateTypeOfUseForCode, validateCity } = require("../middlewares/global.middlewares");

const usersMiddlewares = require("../middlewares/users.midddlewares");

usersRouter.get("/login",
    (req, res, next) => {
        const { text, password } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Text", fieldValue: text, dataType: "string", isRequiredValue: true },
            { fieldName: "Password", fieldValue: password, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => {
        const { text } = req.query;
        if (!isEmail(text) && !isValidMobilePhone(text)) {
            return res.status(400).json(getResponseObject("Please Send Valid Email Or Mobile Phone Status !!", true, {}));
        }
        next();
    },
    (req, res, next) => validatePassword(req.query.password, res, next),
    usersController.login
);

usersRouter.get("/user-info",
    validateJWT,
    usersController.getUserInfo
);

usersRouter.get("/users-count", validateJWT, usersController.getUsersCount);

usersRouter.get("/all-users-inside-the-page",
    validateJWT,
    (req, res, next) => {
        const { pageNumber, pageSize } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(pageNumber), dataType: "number", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(pageSize), dataType: "number", isRequiredValue: true },
        ], res, next);
    },
    usersController.getAllUsersInsideThePage
);

usersRouter.get("/forget-password",
    (req, res, next) => {
        const { text } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Text", fieldValue: text, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => {
        const { text } = req.query;
        if (!isEmail(text) && !isValidMobilePhone(text)) {
            return res.status(400).json(getResponseObject("Please Send Valid Email Or Mobile Phone Status !!", true, {}));
        }
        next();
    },
    usersController.getForgetPassword
);

usersRouter.post("/create-new-user",
    (req, res, next) => {
        const { city, text, password } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "City", fieldValue: city, dataType: "string", isRequiredValue: true },
            { fieldName: "Text", fieldValue: text, dataType: "string", isRequiredValue: true },
            { fieldName: "Password", fieldValue: password, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateCity(req.body.city, res, next),
    (req, res, next) => {
        const { text } = req.body;
        if (!isEmail(text) && !isValidMobilePhone(text)) {
            return res.status(400).json(getResponseObject("Please Send Valid Text ( Email Or Mobile Phone ) !!", true, {}));
        }
        next();
    },
    (req, res, next) => validatePassword(req.body.password, res, next),
    usersController.createNewUser
);

usersRouter.post("/send-account-verification-code",
    // usersMiddlewares.sendingVerificationCodeLimiterMiddleware,
    (req, res, next) => {
        const { email, typeOfUse } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: true },
            { fieldName: "Type Of Use", fieldValue: typeOfUse, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => {
        const { text } = req.query;
        if (!isEmail(text) && !isValidMobilePhone(text)) {
            return res.status(400).json(getResponseObject("Please Send Valid Email Or Mobile Phone Status !!", true, {}));
        }
        next();
    },
    (req, res, next) => validateTypeOfUseForCode(req.query.typeOfUse, res, next),
    usersController.postAccountVerificationCode
);

usersRouter.put("/update-user-info",
    validateJWT,
    (req, res, next) => {
        const { firstName, lastName, previewName, email, password, newPassword } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "First Name", fieldValue: firstName, dataType: "string", isRequiredValue: false },
            { fieldName: "Last Name", fieldValue: lastName, dataType: "string", isRequiredValue: false },
            { fieldName: "Preview Name", fieldValue: previewName, dataType: "string", isRequiredValue: false },
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: false },
            { fieldName: "Password", fieldValue: password, dataType: "string", isRequiredValue: newPassword ? true : false },
            { fieldName: "New Password", fieldValue: newPassword, dataType: "string", isRequiredValue: password ? true : false },
        ], res, next);
    },
    (req, res, next) => {
        const { email } = req.body;
        if (email) {
            validateEmail(email, res, next);
            return;
        }
        next();
    },
    (req, res, next) => {
        const { password } = req.body;
        if (password) {
            validatePassword(password, res, next);
            return;
        }
        next();
    },
    usersController.putUserInfo
);

usersRouter.put("/update-verification-status",
    (req, res, next) => {
        const { email, code } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: true },
            { fieldName: "Code", fieldValue: code, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateEmail(req.query.email, res, next),
    usersController.putVerificationStatus
);

usersRouter.put("/reset-password",
    (req, res, next) => {
        const { text, code, newPassword } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Text", fieldValue: text, dataType: "string", isRequiredValue: true },
            { fieldName: "Code", fieldValue: code, dataType: "string", isRequiredValue: true },
            { fieldName: "New Password", fieldValue: newPassword, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => {
        const { text } = req.query;
        if (!isEmail(text) && !isValidMobilePhone(text)) {
            return res.status(400).json(getResponseObject("Please Send Valid Email Or Mobile Phone Status !!", true, {}));
        }
        next();
    },
    (req, res, next) => validatePassword(req.query.newPassword, res, next),
    usersController.putResetPassword
);

usersRouter.delete("/:userId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "User Id", fieldValue: req.params.userId, dataType: "ObjectId", isRequiredValue: false },
        ], res, next);
    },
    usersController.deleteUser
);

module.exports = usersRouter;