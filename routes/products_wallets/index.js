const walletRouter = require("express").Router();

const walletController = require("../../controllers/products_wallets");

const { validateJWT } = require("../../middlewares/auth");

const { validateIsExistValueForFieldsAndDataTypes } = require("../../helpers/validate");

walletRouter.get("/wallet-products-count", validateJWT, walletController.getWalletProductsCount);

walletRouter.get("/all-wallet-products-inside-the-page",
    validateJWT,
    (req, res, next) => {
        const { pageNumber, pageSize } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(pageNumber), dataTypes: ["number"], isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(pageSize), dataTypes: ["number"], isRequiredValue: true },
        ], res, next);
    },
    walletController.getAllWalletProductsInsideThePage
);

walletRouter.delete("/:productId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: req.params.productId, dataTypes: ["ObjectId"], isRequiredValue: true },
        ], res, next);
    },
    walletController.deleteWalletProduct
);

module.exports = walletRouter;