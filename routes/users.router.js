const usersRouter = require("express").Router();

const usersController = require("../controllers/users.controller");

const { validateIsExistValueForFieldsAndDataTypes, isEmail, isValidMobilePhone, getResponseObject } = require("../global/functions");

const { validateJWT, validateEmail, validatePassword, validateTypeOfUseForCode, validateCity, validateMobilePhone, validateName } = require("../middlewares/global.middlewares");

usersRouter.get("/login",
    (req, res, next) => {
        const { email, mobilePhone, password } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: mobilePhone ? false : true },
            { fieldName: "Mobile Phone", fieldValue: mobilePhone, dataType: "string", isRequiredValue: email ? false : true },
            { fieldName: "Password", fieldValue: password, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => {
        const { email } = req.query;
        if (email) {
            return validateEmail(email, res, next);
        }
        next();
    },
    (req, res, next) => {
        const { mobilePhone } = req.query;
        if (mobilePhone) {
            return validateMobilePhone(mobilePhone, res, next);
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
        const { email, mobilePhone } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: mobilePhone ? false : true },
            { fieldName: "Mobile Phone", fieldValue: mobilePhone, dataType: "string", isRequiredValue: email ? false : true },
        ], res, next);
    },
    (req, res, next) => {
        const { email } = req.query;
        if (email) {
            return validateEmail(email, res, next);
        }
        next();
    },
    (req, res, next) => {
        const { mobilePhone } = req.query;
        if (mobilePhone) {
            return validateMobilePhone(mobilePhone, res, next);
        }
        next();
    },
    usersController.getForgetPassword
);

usersRouter.get("/main-page-data", validateJWT, usersController.getMainPageData);

usersRouter.post("/create-new-user",
    (req, res, next) => {
        const { city, fullName, email, mobilePhone, password } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "City", fieldValue: city, dataType: "string", isRequiredValue: true },
            { fieldName: "Full Name", fieldValue: fullName, dataType: "string", isRequiredValue: true },
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: mobilePhone ? false : true },
            { fieldName: "Mobile Phone", fieldValue: mobilePhone, dataType: "string", isRequiredValue: email ? false : true },
            { fieldName: "Password", fieldValue: password, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateCity(req.body.city, res, next),
    (req, res, next) => validateName(req.body.fullName, res, next),
    (req, res, next) => {
        const { email } = req.body;
        if (email) {
            return validateEmail(email, res, next);
        }
        next();
    },
    (req, res, next) => {
        const { mobilePhone } = req.body;
        if (mobilePhone) {
            return validateMobilePhone(mobilePhone, res, next);
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
        const { fullName, address, email, mobilePhone, city } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Full Name", fieldValue: fullName, dataType: "string", isRequiredValue: false },
            { fieldName: "Address", fieldValue: address, dataType: "string", isRequiredValue: false },
            { fieldName: "Mobile Phone", fieldValue: mobilePhone, dataType: "string", isRequiredValue: false },
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: false },
            { fieldName: "City", fieldValue: city, dataType: "string", isRequiredValue: false },
        ], res, next);
    },
    (req, res, next) => {
        const { fullName } = req.body;
        if (fullName) {
            return validateName(fullName, res, next);
        }
        next();
    },
    (req, res, next) => {
        const { mobilePhone } = req.body;
        if (mobilePhone) {
            return validateMobilePhone(mobilePhone, res, next);
        }
        next();
    },
    (req, res, next) => {
        const { email } = req.body;
        if (email) {
            return validateEmail(email, res, next);
        }
        next();
    },
    (req, res, next) => {
        const { city } = req.body;
        if (city) {
            return validateCity(city, res, next);
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
        const { email, mobilePhone, code, newPassword } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: email, dataType: "string", isRequiredValue: mobilePhone ? false : true },
            { fieldName: "Mobile Phone", fieldValue: mobilePhone, dataType: "string", isRequiredValue: email ? false : true },
            { fieldName: "Code", fieldValue: code, dataType: "string", isRequiredValue: true },
            { fieldName: "New Password", fieldValue: newPassword, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => {
        const { email } = req.query;
        if (email) {
            return validateEmail(email, res, next);
        }
        next();
    },
    (req, res, next) => {
        const { mobilePhone } = req.query;
        if (mobilePhone) {
            return validateMobilePhone(mobilePhone, res, next);
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