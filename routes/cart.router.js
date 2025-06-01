const cartRouter = require("express").Router();

const cartController = require("../controllers/cart.controller");

const { validateJWT, validateNumbersIsGreaterThanZero, validateNumbersIsNotFloat, validateIsExistErrorInFiles, validateSize, validateColor } = require("../middlewares/global.middlewares");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

const multer = require("multer");

cartRouter.post("/add-new-product",
    validateJWT,
    multer({
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            if (!file) {
                return cb(null, true);
            }
            if (
                file.mimetype !== "image/jpeg" &&
                file.mimetype !== "image/png" &&
                file.mimetype !== "image/webp" &&
                file.mimetype !== "application/pdf" &&
                file.mimetype !== "text/plain"
            ) {
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG Or PNG Or WEBP Or PDF Or Text files are allowed !!";
                return cb(null, false);
            }
            cb(null, true);
        }
    }).fields([
        { name: "additionalFiles", maxCount: 10 },
    ]),
    validateIsExistErrorInFiles,
    (req, res, next) => {
        const { productId, quantity, message, customText, additionalNotes, size } = Object.assign({}, req.body);
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: productId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Quantity", fieldValue: Number(quantity), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "Message", fieldValue: message, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Custom Text", fieldValue: customText, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Additional Notes", fieldValue: additionalNotes, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Size", fieldValue: size, dataTypes: ["string"], isRequiredValue: false },
            { fieldName: "Color", fieldValue: size, dataTypes: ["string"], isRequiredValue: false },
        ], res, next);
    },
    (req, res, next) => validateNumbersIsGreaterThanZero([Object.assign({}, req.body).quantity], res, next, ["Sorry, Please Send Valid Quantity( Number Must Be Greater Than Zero ) !!"]),
    (req, res, next) => validateNumbersIsNotFloat([Object.assign({}, req.body).quantity], res, next, ["Sorry, Please Send Valid Quantity( Number Must Be Not Float ) !!"]),
    (req, res, next) => {
        const { size } = Object.assign({}, req.body);
        if (size) {
            return validateSize(size, res, next);
        }
        next();
    },
    (req, res, next) => {
        const { color } = Object.assign({}, req.body);
        if (color) {
            return validateColor(color, res, next);
        }
        next();
    },
    cartController.postNewProduct
);

cartRouter.get("/all-products", validateJWT, cartController.getAllProducts);

cartRouter.get("/cart-length", validateJWT, cartController.getCartLength);

cartRouter.delete("/all-products", validateJWT, cartController.deleteAllProducts);

cartRouter.delete("/:cartId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Cart Id", fieldValue: req.params.cartId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    cartController.deleteProduct
);

cartRouter.put("/:cartId",
    validateJWT,
    (req, res, next) => {
        const { quantity, message } = Object.assign({}, req.body);
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Cart Id", fieldValue: req.params.cartId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "New Quantity", fieldValue: quantity, dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "Message", fieldValue: message, dataTypes: ["string"], isRequiredValue: false },
        ], res, next);
    },
    cartController.putProduct
);

module.exports = cartRouter;