const categoriesRouter = require("express").Router();

const categoriesController = require("../../controllers/categories.controller");

const { validateJWT, validateNumbersIsGreaterThanZero, validateNumbersIsNotFloat, validateIsExistErrorInFiles, validateUserType } = require("../../middlewares/global.middlewares");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../global/functions");

const multer = require("multer");

categoriesRouter.post("/add-new-category",
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
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG, PNG And Webp Files Are Allowed !!";
                return cb(null, false);
            }
            cb(null, true);
        }
    }).single("categoryImg"),
    validateIsExistErrorInFiles,
    (req, res, next) => {
        const { name, color, parent } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Category Name", fieldValue: name, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Category Color", fieldValue: color, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Category Parent Id", fieldValue: parent, dataTypes: ["ObjectId"], isRequiredValue: false },
        ], res, next);
    },
    categoriesController.postNewCategory
);

categoriesRouter.get("/category-info/:categoryId",
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Category Id", fieldValue: req.params.categoryId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    categoriesController.getCategoryInfo
);

categoriesRouter.get("/all-categories",
    validateJWT,
    (req, res, next) => {
        const { userType } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "User Type", fieldValue: userType, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateUserType(req.query.userType, res, next),
    categoriesController.getAllCategories
);

categoriesRouter.get("/all-categories-with-hierarechy", categoriesController.getAllCategoriesWithHierarechy);

categoriesRouter.get("/categories-count", validateJWT, categoriesController.getCategoriesCount);

categoriesRouter.get("/all-categories-inside-the-page",
    validateJWT,
    (req, res, next) => {
        const { pageNumber, pageSize, userType } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(pageNumber), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(pageSize), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "User Type", fieldValue: userType, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateNumbersIsGreaterThanZero([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Greater Than Zero ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Greater Than Zero ) !!"]),
    (req, res, next) => validateNumbersIsNotFloat([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Not Float ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Not Float ) !!"]),
    (req, res, next) => validateUserType(req.query.userType, res, next),
    categoriesController.getAllCategoriesInsideThePage
);

categoriesRouter.delete("/:categoryId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Category Id", fieldValue: req.params.categoryId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    categoriesController.deleteCategory
);

categoriesRouter.put("/:categoryId",
    validateJWT,
    (req, res, next) => {
        const { name, color, parent } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Category Id", fieldValue: req.params.categoryId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "New Category Name", fieldValue: name, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "New Category Color", fieldValue: color, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Category Parent Id", fieldValue: parent, dataTypes: ["ObjectId", "null"], isRequiredValue: false },
        ], res, next);
    },
    categoriesController.putCategory
);

categoriesRouter.put("/change-category-image/:categoryId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Category Id", fieldValue: req.params.categoryId, dataTypes: ["ObjectId"], isRequiredValue: true },
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
    }).single("categoryImage"),
    validateIsExistErrorInFiles,
    categoriesController.putCategoryImage
);

module.exports = categoriesRouter;