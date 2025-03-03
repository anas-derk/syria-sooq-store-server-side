const cartRouter = require("express").Router();

const cartController = require("../controllers/cart.controller");

const { validateJWT, validateNumbersIsGreaterThanZero, validateNumbersIsNotFloat } = require("../middlewares/global.middlewares");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

cartRouter.post("/add-new-product",
    validateJWT,
    (req, res, next) => {
        const { productId, quantity } = Object.assign({}, req.body);
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: productId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "Quantity", fieldValue: Number(quantity), dataTypes: ["number"], isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateNumbersIsGreaterThanZero([Object.assign({}, req.body).quantity], res, next, ["Sorry, Please Send Valid Quantity( Number Must Be Greater Than Zero ) !!"]),
    (req, res, next) => validateNumbersIsNotFloat([Object.assign({}, req.body).quantity], res, next, ["Sorry, Please Send Valid Quantity( Number Must Be Not Float ) !!"]),
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
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Cart Id", fieldValue: req.params.cartId, dataTypes: ["ObjectId"], isRequiredValue: true },
            { fieldName: "New Quantity", fieldValue: req.body.quantity, dataTypes: ["number"], isRequiredValue: true },
        ], res, next);
    },
    cartController.putProduct
);

module.exports = cartRouter;