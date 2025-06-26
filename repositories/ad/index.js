// Import Product Model Object

const { adModel, adminModel, productModel } = require("../../models");

const { getSuitableTranslations } = require("../../global/functions");

async function addNewAd(authorizationId, adsInfo, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                if (await adModel.countDocuments({}) >= 10) {
                    return {
                        msg: getSuitableTranslations("Sorry, Can't Add New Ad Because Arrive To Max Limits For Ads Count ( Limits: 10 ) !!", language),
                        error: true,
                        data: {},
                    }
                }
                const product = await productModel.findById(adsInfo.product);
                if (!product) {
                    return {
                        msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
                        error: false,
                        data: {},
                    }
                }
                adsInfo.storeId = admin.storeId;
                await (new adModel(adsInfo)).save();
                return {
                    msg: getSuitableTranslations("Adding New Text Ad Process Has Been Successfully !!", language),
                    error: false,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Has Been Blocked !!", language),
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllAds(filters, language) {
    try {
        return {
            msg: getSuitableTranslations("Get All Ads Process Has Been Successfully !!", language),
            error: false,
            data: await adModel.find(filters).populate("product"),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteAd(authorizationId, adId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const adInfo = await adModel.findById(adId);
                if (adInfo) {
                    if (adInfo.storeId === admin.storeId) {
                        await adInfo.deleteOne({
                            _id: adId,
                        });
                        return {
                            msg: getSuitableTranslations("Deleting Ad Process Has Been Successfuly !!", language),
                            error: false,
                            data: {
                                deletedAdImagePath: adInfo.imagePath
                            },
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Ad Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Ad Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Has Been Blocked !!", language),
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function updateAdImage(authorizationId, adId, newAdImagePath, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const adInfo = await adModel.findById(adId);
                if (adInfo) {
                    if (adInfo.storeId === admin.storeId) {
                        await adModel.updateOne({ _id: adId }, {
                            imagePath: newAdImagePath,
                        });
                        return {
                            msg: getSuitableTranslations("Change Ad Image Process Has Been Successfully !!", language),
                            error: false,
                            data: {
                                oldAdImagePath: adInfo.imagePath,
                                newAdImagePath
                            },
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Ad Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                        status: 401
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Ad Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Has Been Blocked !!", language),
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function updateAd(authorizationId, adId, newAdInfo, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (!admin.isBlocked) {
                const adInfo = await adModel.findById(adId);
                if (adInfo) {
                    if (adInfo.storeId === admin.storeId) {
                        await adModel.updateOne({ _id: adId }, newAdInfo);
                        return {
                            msg: getSuitableTranslations("Updating Text Ad Content Process Has Been Successfuly !!", language),
                            error: false,
                            data: {},
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Ad Is Not Exist At Store Managed By This Admin !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Ad Is Not Exist !!", language),
                    error: true,
                    data: {},
                };
            }
            return {
                msg: getSuitableTranslations("Sorry, This Admin Has Been Blocked !!", language),
                error: true,
                data: {
                    blockingDate: admin.blockingDate,
                    blockingReason: admin.blockingReason,
                },
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    addNewAd,
    getAllAds,
    deleteAd,
    updateAdImage,
    updateAd
}