const categoriesRouter = require("express").Router();

const categoriesController = require("../controllers/categories.controller");

const { validateJWT, validateNumbersIsGreaterThanZero, validateNumbersIsNotFloat } = require("../middlewares/global.middlewares");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

categoriesRouter.post("/add-new-category",
    validateJWT,
    (req, res, next) => {
        const { name, color, parent } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Category Name", fieldValue: name, dataType: "string", isRequiredValue: true },
            { fieldName: "Category Color", fieldValue: name, dataType: "string", isRequiredValue: true },
            { fieldName: "Category Parent Id", fieldValue: parent, dataType: "ObjectId", isRequiredValue: false },
        ], res, next);
    },
    categoriesController.postNewCategory
);

categoriesRouter.get("/category-info/:categoryId",
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Category Id", fieldValue: req.params.categoryId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    categoriesController.getCategoryInfo
);

categoriesRouter.get("/all-categories", categoriesController.getAllCategories);

categoriesRouter.get("/all-categories-with-hierarechy", categoriesController.getAllCategoriesWithHierarechy);

categoriesRouter.get("/categories-count",
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.query.storeId, dataType: "ObjectId", isRequiredValue: false },
        ], res, next);
    },
    categoriesController.getCategoriesCount
);

categoriesRouter.get("/all-categories-inside-the-page",
    (req, res, next) => {
        const { pageNumber, pageSize } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(pageNumber), dataType: "number", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(pageSize), dataType: "number", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateNumbersIsGreaterThanZero([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Greater Than Zero ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Greater Than Zero ) !!"]),
    (req, res, next) => validateNumbersIsNotFloat([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Not Float ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Not Float ) !!"]),
    categoriesController.getAllCategoriesInsideThePage
);

categoriesRouter.delete("/:categoryId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Category Id", fieldValue: req.params.categoryId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    categoriesController.deleteCategory
);

categoriesRouter.put("/:categoryId",
    validateJWT,
    (req, res, next) => {
        const { name, parent } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Category Id", fieldValue: req.params.categoryId, dataType: "ObjectId", isRequiredValue: true },
            { fieldName: "New Category Name", fieldValue: name, dataType: "string", isRequiredValue: true },
            { fieldName: "Category Parent Id", fieldValue: parent, dataType: "ObjectId", isRequiredValue: false },
        ], res, next);
    },
    categoriesController.putCategory
);

module.exports = categoriesRouter;