const storesRouter = require("express").Router();

const storesController = require("../controllers/stores.controller");

const { validateJWT, validatePassword, validateEmail, validateLanguage, validateName, validateIsExistErrorInFiles } = require("../middlewares/global.middlewares");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

const multer = require("multer");

storesRouter.get("/stores-count", storesController.getStoresCount);

storesRouter.get("/all-stores-inside-the-page",
    (req, res, next) => {
        const { pageNumber, pageSize, _id } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(pageNumber), dataType: "number", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(pageSize), dataType: "number", isRequiredValue: true },
            { fieldName: "Store Id", fieldValue: _id, dataType: "ObjectId", isRequiredValue: false },
        ], res, next);
    },
    storesController.getAllStoresInsideThePage
);

storesRouter.get("/store-details/:storeId",
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    storesController.getStoreDetails
);

storesRouter.get("/main-store-details", storesController.getMainStoreDetails);

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
        const { name, headquarterAddress, taxNumber, ownerFullName, phoneNumber, email, bankAccountInformation } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Name", fieldValue: name, dataType: "string", isRequiredValue: true },
            { fieldName: "Headquarter Address", fieldValue: headquarterAddress, dataType: "string", isRequiredValue: true },
            { fieldName: "Tax Number", fieldValue: taxNumber, dataType: "string", isRequiredValue: true },
            { fieldName: "Owner Full Name", fieldValue: ownerFullName, dataType: "string", isRequiredValue: true },
            { fieldName: "Phone Number", fieldValue: phoneNumber, dataType: "string", isRequiredValue: true },
            { fieldName: "Owner Email", fieldValue: email, dataType: "string", isRequiredValue: true },
            { fieldName: "Bank Account Information", fieldValue: bankAccountInformation, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateName(req.body.ownerFullName, res, next),
    (req, res, next) => validateEmail(req.body.email, res, next),
    storesController.postNewStore
);

storesRouter.post("/approve-store/:storeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataType: "ObjectId", isRequiredValue: true },
            { fieldName: "Password", fieldValue: req.query.password, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validatePassword(req.query.password, res, next),
    storesController.postApproveStore
);

storesRouter.post("/follow-store-by-user/:storeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    storesController.postFollowStoreByUser
);

storesRouter.put("/update-store-info/:storeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataType: "ObjectId", isRequiredValue: false },
        ], res, next);
    },
    storesController.putStoreInfo
);

storesRouter.put("/blocking-store/:storeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataType: "ObjectId", isRequiredValue: true },
            { fieldName: "Blocking Reason", fieldValue: req.query.blockingReason, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    storesController.putBlockingStore
);

storesRouter.put("/cancel-blocking/:storeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    storesController.putCancelBlockingStore
);

storesRouter.put("/change-store-image/:storeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataType: "ObjectId", isRequiredValue: true },
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

storesRouter.delete("/delete-store/:storeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataType: "ObjectId", isRequiredValue: false },
        ], res, next);
    },
    storesController.deleteStore
);

storesRouter.delete("/reject-store/:storeId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.params.storeId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    storesController.deleteRejectStore
);

module.exports = storesRouter;