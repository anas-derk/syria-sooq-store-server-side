const productsRouter = require("express").Router();

const productsController = require("../controllers/products.controller");

const multer = require("multer");

const { validateJWT, validateNumbersIsGreaterThanZero, validateNumbersIsNotFloat, validateSortMethod, validateSortType, validateIsExistErrorInFiles, validateCountries, validateIsPriceGreaterThanDiscount, validateUserType } = require("../middlewares/global.middlewares");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

productsRouter.post("/add-new-product",
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
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG and PNG Or WEBP files are allowed !!";
                return cb(null, false);
            }
            cb(null, true);
        }
    }).fields([
        { name: "productImage", maxCount: 1 },
        { name: "galleryImages", maxCount: 10 },
    ]),
    validateIsExistErrorInFiles,
    (req, res, next) => {
        const { name, price, description, categories, discount, quantity, isAvailableForDelivery } = Object.assign({}, req.body);
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Name", fieldValue: name, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Price", fieldValue: Number(price), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "Description", fieldValue: description, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Categories", fieldValue: categories, dataTypes: ["array"], isRequiredValue: true },
            { fieldName: "Discount", fieldValue: Number(discount), dataTypes: ["number"], isRequiredValue: discount < 0 },
            { fieldName: "Quantity", fieldValue: Number(quantity), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "Is Available For Delivery", fieldValue: isAvailableForDelivery, dataTypes: ["boolean"], isRequiredValue: false },
        ], res, next);
    },
    (req, res, next) => {
        const { price, quantity } = Object.assign({}, req.body);
        validateNumbersIsGreaterThanZero([price, quantity], res, next, ["Sorry, Please Send Valid Product Price ( Number Must Be Greater Than Zero ) !!", "Sorry, Please Send Valid Product Quantity ( Number Must Be Greater Than Zero ) !!"]);
    },
    (req, res, next) => {
        const { categories } = req.body;
        validateIsExistValueForFieldsAndDataTypes(
            categories.map((categoryId, index) => (
                { fieldName: `Id In Category ${index + 1}`, fieldValue: categoryId, dataTypes: ["ObjectId"], isRequiredValue: true }
            ))
            , res, next);
    },
    (req, res, next) => validateNumbersIsNotFloat([(Object.assign({}, req.body)).quantity], res, next, [], "Sorry, Please Send Valid Product Quantity !!"),
    (req, res, next) => {
        const { price, discount } = Object.assign({}, req.body);
        validateIsPriceGreaterThanDiscount(price, discount, res, next);
    },
    productsController.postNewProduct
);

productsRouter.post("/add-new-images-to-product-gallery/:productId",
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
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG and PNG Or WEBP files are allowed !!";
                return cb(null, false);
            }
            cb(null, true);
        }
    }).array("productGalleryImage", 10),
    validateIsExistErrorInFiles,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: req.params.productId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    productsController.postNewImagesToProductGallery
);

productsRouter.post("/products-by-ids",
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Products By Ids", fieldValue: req.body.productsIds, dataTypes: ["array"], isRequiredValue: true }
        ],
            res, next);
    },
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes(
            req.body.productsIds.map((productId, index) => (
                { fieldName: `Id In Product ${index + 1}`, fieldValue: productId, dataTypes: ["ObjectId"], isRequiredValue: true }
            )),
            res, next);
    },
    productsController.getProductsByIds
);

productsRouter.post("/products-by-ids-and-store-id",
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.query.storeId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Products By Ids", fieldValue: req.body.productsIds, dataTypes: ["array"], isRequiredValue: true }
        ],
            res, next);
    },
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes(
            req.body.productsIds.map((productId, index) => (
                { fieldName: `Id In Product ${index + 1}`, fieldValue: productId, dataTypes: ["ObjectId"], isRequiredValue: true }
            )),
            res, next);
    },
    productsController.getProductsByIdsAndStoreId
);

productsRouter.get("/product-info/:productId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: req.params.productId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "User Type", fieldValue: req.query.userType, dataTypes: ["string"], isRequiredValue: false },
        ], res, next);
    },
    (req, res, next) => {
        const { userType } = req.query;
        if (userType) {
            return validateUserType(userType, res, next);
        }
        next();
    },
    productsController.getProductInfo
);

productsRouter.get("/products-count",
    (req, res, next) => {
        const { storeId, categoryId, name } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: storeId, dataTypes: ["ObjectId"], isRequiredValue: false },
            { fieldName: "Category Id", fieldValue: categoryId, dataTypes: ["ObjectId"], isRequiredValue: false },
            { fieldName: "Product Name", fieldValue: name, dataTypes: ["string"], isRequiredValue: false },
        ], res, next);
    },
    productsController.getProductsCount
);

productsRouter.get("/flash-products-count",
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Store Id", fieldValue: req.query.storeId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    productsController.getFlashProductsCount
);

productsRouter.get("/all-products-inside-the-page",
    validateJWT,
    (req, res, next) => {
        const { pageNumber, pageSize, userType, sortBy, sortType } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(pageNumber), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(pageSize), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "User Type", fieldValue: userType, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Sort By", fieldValue: sortBy, dataTypes: ["string"], isRequiredValue: sortType ? true : false },
            { fieldName: "Sort Type", fieldValue: sortType, dataTypes: ["string"], isRequiredValue: sortBy ? true : false },
        ], res, next);
    },
    (req, res, next) => validateNumbersIsGreaterThanZero([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Greater Than Zero ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Greater Than Zero ) !!"]),
    (req, res, next) => validateNumbersIsNotFloat([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Not Float ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Not Float ) !!"]),
    (req, res, next) => validateUserType(req.query.userType, res, next),
    (req, res, next) => {
        const { sortBy } = req.query;
        if (sortBy) {
            validateSortMethod(sortBy, res, next);
            return;
        }
        next();
    },
    (req, res, next) => {
        const { sortType } = req.query;
        if (sortType) {
            validateSortType(sortType, res, next);
            return;
        }
        next();
    },
    productsController.getAllProductsInsideThePage
);

productsRouter.get("/all-flash-products-inside-the-page",
    validateJWT,
    (req, res, next) => {
        const { pageNumber, pageSize, userType, sortBy, sortType } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(pageNumber), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(pageSize), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "User Type", fieldValue: userType, dataTypes: ["string"], isRequiredValue: true },
            { fieldName: "Sort By", fieldValue: sortBy, dataTypes: ["string"], isRequiredValue: sortType ? true : false },
            { fieldName: "Sort Type", fieldValue: sortType, dataTypes: ["string"], isRequiredValue: sortBy ? true : false },
        ], res, next);
    },
    (req, res, next) => validateNumbersIsGreaterThanZero([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Greater Than Zero ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Greater Than Zero ) !!"]),
    (req, res, next) => validateNumbersIsNotFloat([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Not Float ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Not Float ) !!"]),
    (req, res, next) => validateUserType(req.query.userType, res, next),
    (req, res, next) => {
        const { sortBy } = req.query;
        if (sortBy) {
            validateSortMethod(sortBy, res, next);
            return;
        }
        next();
    },
    (req, res, next) => {
        const { sortType } = req.query;
        if (sortType) {
            validateSortType(sortType, res, next);
            return;
        }
        next();
    },
    productsController.getAllFlashProductsInsideThePage
);

productsRouter.get("/all-products-by-category-inside-the-page/:categoryId",
    validateJWT,
    (req, res, next) => {
        const { pageNumber, pageSize } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(pageNumber), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(pageSize), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "Category Id", fieldValue: req.params.categoryId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateNumbersIsGreaterThanZero([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Greater Than Zero ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Greater Than Zero ) !!"]),
    (req, res, next) => validateNumbersIsNotFloat([req.query.pageNumber, req.query.pageSize], res, next, ["Sorry, Please Send Valid Page Number ( Number Must Be Not Float ) !!", "Sorry, Please Send Valid Page Size ( Number Must Be Not Float ) !!"]),
    productsController.getAllProductsByCategoryInsideThePage
);

productsRouter.get("/sample-from-related-products-in-the-product/:productId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: req.params.productId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    productsController.getRelatedProductsInTheProduct
);

productsRouter.get("/all-gallery-images/:productId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: req.params.productId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    productsController.getAllGalleryImages
);

productsRouter.delete("/:productId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: req.params.productId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    productsController.deleteProduct
);

productsRouter.delete("/gallery-images/:productId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: req.params.productId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Gallery Image Path", fieldValue: req.query.galleryImagePath, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    productsController.deleteImageFromProductGallery
);

productsRouter.put("/:productId",
    validateJWT,
    (req, res, next) => {
        const { name, price, description, categories, discount, quantity, countries } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: req.params.productId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Name", fieldValue: name, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Price", fieldValue: Number(price), dataTypes: ["number"], isRequiredValue: false },
            { fieldName: "Description", fieldValue: description, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Categories", fieldValue: categories, dataTypes: ["array"], isRequiredValue: false },
            { fieldName: "Discount", fieldValue: Number(discount), dataTypes: ["number"], isRequiredValue: false },
            { fieldName: "Quantity", fieldValue: Number(quantity), dataTypes: ["number"], isRequiredValue: false },
            { fieldName: "Countries", fieldValue: countries, dataTypes: ["array"], isRequiredValue: false },
        ], res, next);
    },
    (req, res, next) => {
        const { price } = Object.assign({}, req.body);
        if (price) {
            return validateNumbersIsGreaterThanZero([price], res, next, ["Sorry, Please Send Valid Product Price ( Number Must Be Greater Than Zero ) !!"]);
        }
        next();
    },
    (req, res, next) => {
        const { discount } = Object.assign({}, req.body);
        if (discount) {
            return validateNumbersIsGreaterThanZero([discount], res, next, ["Sorry, Please Send Valid Product Discount ( Number Must Be Greater Than Zero ) !!"]);
        }
        next();
    },
    (req, res, next) => {
        const { quantity } = Object.assign({}, req.body);
        if (quantity) {
            return validateNumbersIsGreaterThanZero([quantity], res, next, ["Sorry, Please Send Valid Product Quantity ( Number Must Be Greater Than Zero ) !!"]);
        }
        next();
    },
    (req, res, next) => {
        const { price, discount } = Object.assign({}, req.body);
        if (price && discount) {
            return validateIsPriceGreaterThanDiscount(price, discount, res, next);
        }
        next();
    },
    (req, res, next) => {
        const { categories } = req.body;
        if (categories) {
            return validateIsExistValueForFieldsAndDataTypes(
                categories.map((categoryId, index) => (
                    { fieldName: `Id In Category ${index + 1}`, fieldValue: categoryId, dataTypes: ["ObjectId"], isRequiredValue: true }
                ))
                , res, next);
        }
        next();
    },
    (req, res, next) => {
        const { countries } = Object.assign({}, req.body);
        if (countries) {
            let errorMsgs = [];
            for (let i = 0; i < countries.length; i++) {
                errorMsgs.push(`Sorry, Please Send Valid Country At Index: ${i + 1} !!`);
            }
            return validateCountries(countries, res, next, errorMsgs);
        }
        next();
    },
    productsController.putProduct
);

productsRouter.put("/update-product-gallery-image/:productId",
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
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG and PNG Or WEBP files are allowed !!";
                return cb(null, false);
            }
            cb(null, true);
        }
    }).single("productGalleryImage"),
    validateIsExistErrorInFiles,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: req.params.productId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Old Gallery Image Path", fieldValue: req.query.oldGalleryImagePath, dataTypes: ["string"], isRequiredValue: true },
        ], res, next);
    },
    productsController.putProductGalleryImage
);

productsRouter.put("/update-product-image/:productId",
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
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG and PNG Or WEBP files are allowed !!";
                return cb(null, false);
            }
            cb(null, true);
        }
    }).single("productImage"),
    validateIsExistErrorInFiles,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: req.params.productId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    productsController.putProductImage
);

module.exports = productsRouter;