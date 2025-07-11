const { responsesHelpers, translationHelpers } = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations } = translationHelpers;

const productsWalletsOPerationsManagmentFunctions = require("../../repositories/products_wallets");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "userId") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function getWalletProductsCount(req, res) {
    try {
        res.json(await productsWalletsOPerationsManagmentFunctions.getWalletProductsCount(getFiltersObject({ ...req.query, userId: req.data._id }), req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllWalletProductsInsideThePage(req, res) {
    try {
        const filters = req.query;
        res.json(await productsWalletsOPerationsManagmentFunctions.getAllWalletProductsInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject({ ...filters, userId: req.data._id }), req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteWalletProduct(req, res) {
    try {
        res.json(await productsWalletsOPerationsManagmentFunctions.deleteWalletProduct(req.data._id, req.params.productId, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

module.exports = {
    getWalletProductsCount,
    getAllWalletProductsInsideThePage,
    deleteWalletProduct
}