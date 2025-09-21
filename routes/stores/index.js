const storesRouter = require("express").Router();

const storesController = require("../../controllers/stores");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../helpers/validate");

const {
    authMiddlewares,
    commonMiddlewares,
    filesMiddlewares,
    usersMiddlewares,
    storesMiddlewares,
} = require("../../middlewares");

const {
    validateJWT,
    validatePassword,
    validateEmail
} = authMiddlewares;

const {
    validateName
} = commonMiddlewares;

const {
    validateIsExistErrorInFiles
} = filesMiddlewares;

const {
    validateUserType
} = usersMiddlewares;

const {
    validateCity
} = commonMiddlewares;

const {
    validateStoreCategory
} = storesMiddlewares;

const multer = require("multer");
const { validateWorkingHours } = require("../../middlewares/stores");

storesRouter.get("/stores-count", validateJWT, storesController.getStoresCount);

storesRouter.get("/all-stores-inside-the-page",
    validateJWT,
    (req, res, next) => {
        const { pageNumber, pageSize, _id } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(pageNumber), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(pageSize), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "Store Id", fieldValue: _id, dataTypes: ["ObjectId"], isRequiredValue: false },
        ], res, next);
    },
    storesController.getAllStoresInsideThePage
);

storesRouter.get("/store-details/:storeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "User Type", fieldValue: req.query.userType, dataTypes: ["string"], isRequiredValue: false },
        ], res, next);
    },
    (req, res, next) => {
        const { userType } = req.query;
        if (userType) {
            return validateUserType(req.query.userType, res, next);
        }
        next();
    },
    storesController.getStoreDetails
);

storesRouter.get("/main-store-details", validateJWT, storesController.getMainStoreDetails);

storesRouter.get("/all-user-stores", validateJWT, storesController.getAllUserStores);

storesRouter.post("/create-new-store",
    validateJWT,
    multer({
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            if (!file) {
                req.uploadError = "Sorry, No File Uploaded, Please Upload The File";
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
    }).fields([
        {
            name: "coverImage",
            maxCount: 1,
        },
        {
            name: "profileImage",
            maxCount: 1,
        },
        {
            name: "commercialRegisterFile",
            maxCount: 1,
        },
        {
            name: "taxCardFile",
            maxCount: 1,
        },
        {
            name: "addressProofFile",
            maxCount: 1,
        }
    ]),
    validateIsExistErrorInFiles,
    (req, res, next) => {
        const { name, city, category, headquarterAddress, taxNumber, ownerFullName, phoneNumber, email, bankAccountInformation, isClosed, isDeliverable, workingHours } = Object.assign({}, req.body);
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Name", fieldValue: name, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "City", fieldValue: city, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Category", fieldValue: category, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Headquarter Address", fieldValue: headquarterAddress, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Tax Number", fieldValue: taxNumber, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Owner Full Name", fieldValue: ownerFullName, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Phone Number", fieldValue: phoneNumber, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Owner Email", fieldValue: email, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Bank Account Information", fieldValue: bankAccountInformation, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Is Closed", fieldValue: isClosed === "true" ?? false, dataTypes: ["boolean"], isRequiredValue: false },
            { fieldName: "Is Deliverable", fieldValue: isDeliverable === "true" ?? false, dataTypes: ["boolean"], isRequiredValue: false },
            { fieldName: "Working Hours", fieldValue: workingHours ? JSON.parse(workingHours) : workingHours, dataTypes: ["array"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateName(Object.assign({}, req.body).ownerFullName, res, next),
    (req, res, next) => validateCity(Object.assign({}, req.body).city, res, next),
    (req, res, next) => validateStoreCategory(Object.assign({}, req.body).category, res, next),
    (req, res, next) => validateEmail(Object.assign({}, req.body).email, res, next),
    (req, res, next) => {
        const { workingHours } = Object.assign({}, req.body);
        workingHoursAfterProcess = JSON.parse(workingHours);
        validateIsExistValueForFieldsAndDataTypes(
            workingHoursAfterProcess.flatMap((hours, index) => ([
                { fieldName: `Day In Index: ${index + 1}`, fieldValue: hours?.day, dataTypes: ["string"], isRequiredValue: true },
                { fieldName: `Time For Open Time In Day ${index + 1}`, fieldValue: hours?.openTime.time, dataTypes: ["string"], isRequiredValue: hours?.closeTime.time ?? false },
                { fieldName: `Period For Open Time In Day ${index + 1}`, fieldValue: hours?.openTime.period, dataTypes: ["string"], isRequiredValue: hours?.openTime.time ?? false },
                { fieldName: `Time For Close Time In Day ${index + 1}`, fieldValue: hours?.closeTime.time, dataTypes: ["string"], isRequiredValue: hours?.openTime.time ?? false },
                { fieldName: `Period For Close Time In Day ${index + 1}`, fieldValue: hours?.closeTime.period, dataTypes: ["string"], isRequiredValue: hours?.closeTime.time ?? false },

            ]))
            , res, next);
    },
    (req, res, next) => {
        const { workingHours } = Object.assign({}, req.body);
        validateWorkingHours(JSON.parse(workingHours), res, next);
    },
    storesController.postNewStore
);

storesRouter.post("/approve-store/:storeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Password", fieldValue: req.query.password, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validatePassword(req.query.password, res, next),
    storesController.postApproveStore
);

storesRouter.post("/follow-store-by-user/:storeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    storesController.postFollowStoreByUser
);

storesRouter.put("/update-store-info/:storeId", validateJWT, storesController.putStoreInfo);

storesRouter.put("/change-close-status/:storeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Is Closed", fieldValue: req.body.isClosed, dataTypes: ["boolean"], isRequiredValue: false },
        ], res, next);
    },
    storesController.putCloseStatus
);

storesRouter.put("/blocking-store/:storeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Blocking Reason", fieldValue: req.query.blockingReason, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    storesController.putBlockingStore
);

storesRouter.put("/cancel-blocking/:storeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    storesController.putCancelBlockingStore
);

storesRouter.put("/change-store-image/:storeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
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
    }).single("storeImage"),
    validateIsExistErrorInFiles,
    storesController.putStoreImage
);

storesRouter.put("/store-verification/:storeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    storesController.putStoreVerification
);

storesRouter.delete("/delete-store/:storeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataTypes: ["ObjectId"], isRequiredValue: false },
        ], res, next);
    },
    storesController.deleteStore
);

storesRouter.delete("/reject-store/:storeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    storesController.deleteRejectStore
);

module.exports = storesRouter;