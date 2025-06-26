const usersRouter = require("express").Router();

const usersController = require("../../controllers/users.controller");

const { validateIsExistValueForFieldsAndDataTypes, isEmail, isValidMobilePhone, getResponseObject } = require("../../global/functions");

const { validateJWT, validateEmail, validatePassword, validateTypeOfUseForCode, validateCity, validateMobilePhone, validateName, validateIsExistErrorInFiles, validateUserType } = require("../../middlewares/global.middlewares");

const multer = require("multer");

usersRouter.get("/login",
    (req, res, next) => {
        const { email, mobilePhone, password } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: email, dataTypes: ["string"], isRequiredValue: mobilePhone ? false : true },
            { fieldName: "Mobile Phone", fieldValue: mobilePhone, dataTypes: ["string"], isRequiredValue: email ? false : true },
            { fieldName: "Password", fieldValue: password, dataTypes: ["string"], isRequiredValue: true },
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
            { fieldName: "page Number", fieldValue: Number(pageNumber), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(pageSize), dataTypes: ["number"], isRequiredValue: true },
        ], res, next);
    },
    usersController.getAllUsersInsideThePage
);

usersRouter.get("/forget-password",
    (req, res, next) => {
        const { email, mobilePhone } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: email, dataTypes: ["string"], isRequiredValue: mobilePhone ? false : true },
            { fieldName: "Mobile Phone", fieldValue: mobilePhone, dataTypes: ["string"], isRequiredValue: email ? false : true },
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
            { fieldName: "City", fieldValue: city, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Full Name", fieldValue: fullName, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Email", fieldValue: email, dataTypes: ["string"], isRequiredValue: mobilePhone ? false : true },
            { fieldName: "Mobile Phone", fieldValue: mobilePhone, dataTypes: ["string"], isRequiredValue: email ? false : true },
            { fieldName: "Password", fieldValue: password, dataTypes: ["string"], isRequiredValue: true },
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

usersRouter.post("/add-new-interests",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Interests", fieldValue: req.body.interests, dataTypes: ["array"], isRequiredValue: true }
        ],
            res, next);
    },
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes(req.body.interests.map((category) => ({ fieldName: "Category", fieldValue: category, dataTypes: ["ObjectId"], isRequiredValue: true })), res, next);
    },
    usersController.postAddNewInterests
);

usersRouter.post("/send-account-verification-code",
    // usersMiddlewares.sendingVerificationCodeLimiterMiddleware,
    (req, res, next) => {
        const { email, typeOfUse } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: email, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Type Of Use", fieldValue: typeOfUse, dataTypes: ["string"], isRequiredValue: true },
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
        const { fullName, addresses, email, mobilePhone, city } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Full Name", fieldValue: fullName, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Address", fieldValue: addresses, dataTypes: ["array"], isRequiredValue: false },
            { fieldName: "Mobile Phone", fieldValue: mobilePhone, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Email", fieldValue: email, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "City", fieldValue: city, dataTypes: ["string"], isRequiredValue: false },
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
        const { addresses } = req.body;
        if (addresses) {
            return validateIsExistValueForFieldsAndDataTypes(addresses.map((address, index) => (
                { fieldName: `Address ${index + 1}`, fieldValue: address, dataTypes: ["string"], isRequiredValue: false }
            )), res, next);
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
            { fieldName: "Email", fieldValue: email, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Code", fieldValue: code, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateEmail(req.query.email, res, next),
    usersController.putVerificationStatus
);

usersRouter.put("/reset-password",
    (req, res, next) => {
        const { email, mobilePhone, code, newPassword } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: email, dataTypes: ["string"], isRequiredValue: mobilePhone ? false : true },
            { fieldName: "Mobile Phone", fieldValue: mobilePhone, dataTypes: ["string"], isRequiredValue: email ? false : true },
            { fieldName: "Code", fieldValue: code, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "New Password", fieldValue: newPassword, dataTypes: ["string"], isRequiredValue: true },
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

usersRouter.put("/change-user-image",
    validateJWT,
    multer({
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            if (!file) {
                req.uploadError = "Sorry, No Files Uploaded, Please Upload The Files";
                return cb(null, false);
            }
            if (
                file.mimetype !== "image/jpeg" &&
                file.mimetype !== "image/png" &&
                file.mimetype !== "image/webp"
            ) {
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG, PNG And Webp files are allowed !!";
                return cb(null, false);
            }
            cb(null, true);
        }
    }).single("userImage"),
    validateIsExistErrorInFiles,
    usersController.putUserImage
);

usersRouter.delete("/delete-user",
    validateJWT,
    (req, res, next) => {
        const { userType, userId } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "User Type", fieldValue: userType, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "User Id", fieldValue: userId, dataTypes: ["ObjectId"], isRequiredValue: userType === "admin" },
        ], res, next);
    },
    (req, res, next) => {
        const { userType } = req.query;
        if (userType) {
            return validateUserType(userType, res, next);
        }
        next();
    },
    usersController.deleteUser
);

module.exports = usersRouter;