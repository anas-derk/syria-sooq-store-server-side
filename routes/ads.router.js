const adsRouter = require("express").Router();

const adsController = require("../controllers/ads.controller");

const multer = require("multer");

const { validateJWT, validateIsExistErrorInFiles } = require("../middlewares/global.middlewares");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

adsRouter.post("/add-new-ad",
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
            ){
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG, PNG And Webp files are allowed !!";
                return cb(null, false);
            }
            cb(null, true);
        }
    }).single("adImage"),
    validateIsExistErrorInFiles,
    (req, res, next) => {
        const { content } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Content", fieldValue: content, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    adsController.postNewAd
);

adsRouter.get("/all-ads", adsController.getAllAds);

adsRouter.delete("/:adId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Ad Id", fieldValue: req.params.adId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    adsController.deleteAd
);

adsRouter.put("/change-ad-image/:adId",
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
            ){
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG and PNG Or WEBP files are allowed !!";
                return cb(null, false);
            }
            cb(null, true);
        }
    }).single("adImage"),
    validateIsExistErrorInFiles,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Ad Id", fieldValue: req.params.adId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    adsController.putAdImage
);

adsRouter.put("/update-ad-content/:adId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Ad Id", fieldValue: req.params.adId, dataType: "ObjectId", isRequiredValue: true },
            { fieldName: "New Ad Content", fieldValue: req.body.content, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    adsController.putTextAdContent
);

module.exports = adsRouter;