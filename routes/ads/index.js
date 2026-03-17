const adsRouter = require("express").Router();

const adsController = require("../../controllers/ads");

const multer = require("multer");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../helpers/validate");

const {
    authMiddlewares,
    filesMiddlewares,
    adsMiddlewares,
    commonMiddlewares,
} = require("../../middlewares");

const {
    validateJWT,
} = authMiddlewares;

const {
    validateIsExistErrorInFiles,
    validateRealFilesType,
} = filesMiddlewares;

const {
    validateAdvertismentType,
} = adsMiddlewares;

const {
    validateCity
} = commonMiddlewares;

const { UPLOAD_MAX_FILE_SIZE } = require("../../constants/files");

adsRouter.post("/add-new-ad",
    validateJWT,
    multer({
        storage: multer.memoryStorage(),
        limits: UPLOAD_MAX_FILE_SIZE,
        fileFilter: (req, file, cb) => {
            if (!file) {
                req.uploadError = "Sorry, No File Uploaded, Please Upload The File";
                return cb(null, false);
            }
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp",
            ];
            if (
                !allowedTypes.includes(file.mimetype)
            ) {
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG, PNG And Webp files are allowed !!";
                return cb(null, false);
            }
            req.storageType = "memory";
            req.allowedMimeTypes = allowedTypes;
            cb(null, true);
        }
    }).single("adImage"),
    validateIsExistErrorInFiles,
    validateRealFilesType,
    (req, res, next) => {
        const { content, type, city, product } = Object.assign({}, req.body);
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Type", fieldValue: type, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Content", fieldValue: content, dataTypes: ["string"], isRequiredValue: type === "elite" },
            { fieldName: "City", fieldValue: city, dataTypes: ["string"], isRequiredValue: type === "panner" },
            { fieldName: "Product", fieldValue: product, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateAdvertismentType((Object.assign({}, req.body)).type, res, next),
    (req, res, next) => {
        const { city } = req.body;
        if (city) {
            return validateCity((Object.assign({}, req.body)).city, res, next);
        }
        next();
    },
    adsController.postNewAd
);

adsRouter.get("/all-ads", adsController.getAllAds);

adsRouter.delete("/:adId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Ad Id", fieldValue: req.params.adId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    adsController.deleteAd
);

adsRouter.put("/change-ad-image/:adId",
    validateJWT,
    multer({
        storage: multer.memoryStorage(),
        limits: UPLOAD_MAX_FILE_SIZE,
        fileFilter: (req, file, cb) => {
            if (!file) {
                req.uploadError = "Sorry, No File Uploaded, Please Upload The File";
                return cb(null, false);
            }
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp",
            ];
            if (
                !allowedTypes.includes(file.mimetype)
            ) {
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG, PNG And Webp files are allowed !!";
                return cb(null, false);
            }
            req.storageType = "memory";
            req.allowedMimeTypes = allowedTypes;
            cb(null, true);
        }
    }).single("adImage"),
    validateIsExistErrorInFiles,
    validateRealFilesType,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Ad Id", fieldValue: req.params.adId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    adsController.putAdImage
);

adsRouter.put("/update-ad/:adId",
    validateJWT,
    (req, res, next) => {
        const { content, city } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Ad Id", fieldValue: req.params.adId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "New Ad Content", fieldValue: content, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "New Ad City", fieldValue: city, dataTypes: ["string"], isRequiredValue: false },
        ], res, next);
    },
    (req, res, next) => {
        const { city } = req.body;
        if (city) {
            return validateCity((Object.assign({}, req.body)).city, res, next);
        }
        next();
    },
    adsController.putAd
);

module.exports = adsRouter;