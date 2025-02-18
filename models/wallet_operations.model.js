// Import Card Operations Model Object

const { walletOperationsModel, userModel } = require("./all.models");

const { getSuitableTranslations } = require("../global/functions");

async function getAllWalletOperationsInsideThePage(authorizationId, pageNumber, pageSize, language) {
    try {
        const user = await userModel.findById(authorizationId);
        if (user) {
            return {
                msg: getSuitableTranslations("Get All Card Operations For This User Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
                error: false,
                data: await walletOperationsModel.find({ userId: authorizationId }).skip((pageNumber - 1) * pageSize).limit(pageSize),
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

module.exports = {
    getAllWalletOperationsInsideThePage,
}