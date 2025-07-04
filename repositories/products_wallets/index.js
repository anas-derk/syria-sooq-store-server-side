// Import Wallet Product Object

const { productsWalletModel, userModel } = require("../../models");

const { getSuitableTranslations } = require("../../helpers/translation");

async function getWalletProductsCount(filters, language) {
    try {
        return {
            msg: getSuitableTranslations("Get Products Count Inside The Wallet For This User Process Has Been Successfully !!", language),
            error: false,
            data: await productsWalletModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllWalletProductsInsideThePage(pageNumber, pageSize, filters, language) {
    try {
        return {
            msg: getSuitableTranslations("Get All Products Inside The Wallet For This User The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
            error: false,
            data: await productsWalletModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteWalletProduct(userId, productId, language) {
    try {
        const user = await userModel.findById(userId);
        if (user) {
            const walletProduct = await productsWalletModel.findOneAndDelete({ productId, userId });
            if (walletProduct) {
                return {
                    msg: "Deleting Product From Wallet For This User Process Has Been Successfully !!",
                    error: false,
                    data: {},
                }
            }
            return {
                msg: "Sorry, This Product Inside The Wallet For This User Is Not Exist !!",
                error: true,
                data: {},
            }
        }
        return {
            msg: "Sorry, This User Is Not Exist !!",
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    getWalletProductsCount,
    getAllWalletProductsInsideThePage,
    deleteWalletProduct
}