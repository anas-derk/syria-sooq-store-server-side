// Import Cart Model Object

const { cartModel, productModel, userModel } = require("../models/all.models");

const { getSuitableTranslations } = require("../global/functions");

async function addNewProduct(authorizationId, productInfo, language) {
    try {
        const userInfo = await userModel.findById(authorizationId);
        if (userInfo) {
            const product = await productModel.findById(productInfo.productId);
            if (product) {
                await (new cartModel({
                    userId: authorizationId,
                    product: productInfo.productId,
                    quantity: productInfo.quantity,
                })).save();
                return {
                    msg: getSuitableTranslations("Adding New Product To Cart For This User Process Has Been Successfuly !!", language),
                    error: false,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllProducts(authorizationId, language) {
    try {
        const userInfo = await userModel.findById(authorizationId);
        if (userInfo) {
            return {
                msg: getSuitableTranslations("Get All Products Inside The Cart For This User Process Has Been Successfully !!", language),
                error: false,
                data: await cartModel.find({ userId: authorizationId }).populate("product"),
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteAllProducts(authorizationId, language) {
    try {
        const userInfo = await userModel.findById(authorizationId);
        if (userInfo) {
            const result = await cartModel.deleteMany({ userId: authorizationId });
            if (result.deletedCount > 0) {
                return {
                    msg: getSuitableTranslations("Deleting All Products Inside Cart For This User Process Has Been Successfuly !!", language),
                    error: false,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, Can't Find Any Products Inside Cart For This User !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteProduct(authorizationId, cartId, language) {
    try {
        const userInfo = await userModel.findById(authorizationId);
        if (userInfo) {
            const product = await cartModel.findOneAndDelete({ _id: cartId });
            if (product) {
                return {
                    msg: getSuitableTranslations("Deleting Product From Cart For This User Process Has Been Successfuly !!", language),
                    error: false,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function updateProduct(authorizationId, cartId, newData, language) {
    try {
        const userInfo = await userModel.findById(authorizationId);
        if (userInfo) {
            const product = await cartModel.findOneAndUpdate({ _id: cartId }, newData);
            if (product) {
                return {
                    msg: getSuitableTranslations("Updating Product Info Inside The Cart For This User Process Has Been Successfully !!", language),
                    error: false,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    addNewProduct,
    getAllProducts,
    deleteAllProducts,
    deleteProduct,
    updateProduct,
}