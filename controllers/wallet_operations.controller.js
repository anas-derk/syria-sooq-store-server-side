const { getResponseObject, getSuitableTranslations } = require("../global/functions");

// const cardOPerationsManagmentFunctions = require("../models/wallet_operation.model");

async function getAllWalletOperationsInsideThePage(req, res) {
    try {
        const { pageNumber, pageSize, language } = req.query;
        const result = await cardOPerationsManagmentFunctions.getAllWalletOperationsInsideThePage(req.data._id, pageNumber, pageSize, language);
        if (result.error) {
            return res.status(401).json(result);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}), true, {}));
    }
}

module.exports = {
    getAllWalletOperationsInsideThePage,
}