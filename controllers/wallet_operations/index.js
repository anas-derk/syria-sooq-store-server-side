const { getResponseObject, getSuitableTranslations } = require("../../global/functions");

const walletPerationsManagmentFunctions = require("../../repositories/wallet_operations");

async function getAllWalletOperationsInsideThePage(req, res) {
    try {
        const { pageNumber, pageSize, language } = req.query;
        const result = await walletPerationsManagmentFunctions.getAllWalletOperationsInsideThePage(req.data._id, pageNumber, pageSize, language);
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