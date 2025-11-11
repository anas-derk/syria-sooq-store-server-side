// Import Cart Model Object

const { cartModel, productModel, userModel } = require("../../models");

const { getSuitableTranslations } = require("../../helpers/translation");

async function addNewProduct(authorizationId, productInfo, language) {
    try {
        const userInfo = await userModel.findById(authorizationId);
        if (userInfo) {
            const product = await productModel.findById(productInfo.productId);
            if (product) {
                if (productInfo.customText && !product?.customizes?.allowCustomText) {
                    return {
                        msg: getSuitableTranslations("Sorry, Write Custom Text Is Not Allowed For This Product !!", language),
                        error: true,
                        data: {},
                    }
                }
                if (productInfo.additionalNotes && !product?.customizes?.allowAdditionalNotes) {
                    return {
                        msg: getSuitableTranslations("Sorry, Write Additional Notes Is Not Allowed For This Product !!", language),
                        error: true,
                        data: {},
                    }
                }
                if (Array.isArray(productInfo?.additionalFiles)) {
                    if (productInfo.additionalFiles.length > 0 && !product?.customizes?.allowUploadImages) {
                        return {
                            msg: getSuitableTranslations("Sorry, Upload Images Is Not Allowed For This Product !!", language),
                            error: true,
                            data: {},
                        }
                    }
                }
                if (productInfo.size) {
                    if (!product?.customizes?.sizes) {
                        return {
                            msg: getSuitableTranslations("Sorry, Select Size Is Not Allowed For This Product !!", language),
                            error: true,
                            data: {},
                        }
                    }
                    if (!product?.customizes?.sizes?.[size]) {
                        return {
                            msg: getSuitableTranslations("Sorry, This Size Is Not Allowed For This Product !!", language),
                            error: true,
                            data: {},
                        }
                    }
                }
                if (productInfo.color) {
                    if (!product?.customizes?.colors?.length === 0) {
                        return {
                            msg: getSuitableTranslations("Sorry, Select Color Is Not Allowed For This Product !!", language),
                            error: true,
                            data: {},
                        }
                    }
                    if (!product?.customizes?.colors?.includes(productInfo.color)) {
                        return {
                            msg: getSuitableTranslations("Sorry, This Color Is Not Allowed For This Product !!", language),
                            error: true,
                            data: {},
                        }
                    }
                }
                await (new cartModel({
                    userId: authorizationId,
                    product: productInfo.productId,
                    quantity: productInfo.quantity,
                    additionalFiles: productInfo.additionalFiles,
                    ...productInfo.message && { message: productInfo.message },
                    ...productInfo.customText && { customText: productInfo.customText },
                    ...productInfo.additionalNotes && { additionalNotes: productInfo.additionalNotes },
                })).save();
                return {
                    msg: getSuitableTranslations("Adding New Product To Cart For This User Process Has Been Successfuly !!", language),
                    error: false,
                    data: {
                        cartLength: await cartModel.countDocuments({ userId: authorizationId }),
                    },
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

async function getCartLength(authorizationId, language) {
    try {
        const userInfo = await userModel.findById(authorizationId);
        if (userInfo) {
            return {
                msg: getSuitableTranslations("Get Cart Length For This User Process Has Been Successfully !!", language),
                error: false,
                data: await cartModel.countDocuments({ userId: authorizationId }),
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
            const product = await cartModel.findOneAndUpdate({ _id: cartId }, {
                quantity: newData.quantity,
                ...newData.message !== undefined && { message: newData.message }
            });
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
    getCartLength,
    deleteAllProducts,
    deleteProduct,
    updateProduct,
}