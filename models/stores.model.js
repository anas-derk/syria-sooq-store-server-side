// Import  Order Model Object

const { storeModel, adminModel, categoryModel, productModel, userModel } = require("../models/all.models");

// require bcryptjs module for password encrypting

const { hash } = require("bcryptjs");

const { getSuitableTranslations } = require("../global/functions");

async function getStoresCount(authorizationId, filters, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                return {
                    msg: getSuitableTranslations("Get Stores Count Process Has Been Successfully !!", language),
                    error: false,
                    data: await storeModel.countDocuments(filters),
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Found !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getAllStoresInsideThePage(authorizationId, pageNumber, pageSize, filters, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                return {
                    msg: getSuitableTranslations("Get All Stores Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
                    error: false,
                    data: {
                        stores: await storeModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({ creatingOrderDate: -1 }),
                        storesCount: await storeModel.countDocuments(filters)
                    },
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Found !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getStoreDetails(authorizationId, storeId, userType = "user", language) {
    try {
        const user = userType === "user" ? await userModel.findById(authorizationId) : await adminModel.findById(authorizationId);
        if (user) {
            const store = await storeModel.findById(storeId);
            if (store) {
                return {
                    msg: getSuitableTranslations("Get Details For This Store Process Has Been Successfully !!", language),
                    error: false,
                    data: store,
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Store Is Not Found !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Found !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getMainStoreDetails(authorizationId, language) {
    try {
        const user = await userModel.findById(authorizationId);
        if (user) {
            const store = await storeModel.findOne({ isMainStore: true });
            if (store) {
                return {
                    msg: getSuitableTranslations("Get Main Store Details Process Has Been Successfully !!", language),
                    error: false,
                    data: store,
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Store Is Not Found !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Found !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function createNewStore(storeDetails, language) {
    try {
        const store = await storeModel.findOne({ email: storeDetails.email });
        if (store) {
            return {
                msg: getSuitableTranslations("Sorry, This Email Is Already Exist !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Creating Licence Request New Store Process Has Been Successfully !!", language),
            error: false,
            data: await (new storeModel(storeDetails)).save(),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function approveStore(authorizationId, storeId, password, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const store = await storeModel.findById(storeId);
                if (store) {
                    if (store.status === "approving") {
                        return {
                            msg: getSuitableTranslations("Sorry, This Store Is Already Approved !!", language),
                            error: true,
                            data: {},
                        }
                    }
                    if (store.status === "blocking") {
                        return {
                            msg: getSuitableTranslations("Sorry, This Store Is Blocked !!", language),
                            error: true,
                            data: {
                                blockingDate: store.blockingDate,
                                blockingReason: store.blockingReason,
                            },
                        };
                    }
                    await storeModel.updateOne({ _id: storeId }, { status: "approving", approveDate: Date.now() });
                    const newMerchant = new adminModel({
                        fullName: store.ownerFullName,
                        email: store.email,
                        password: await hash(password, 10),
                        isMerchant: true,
                        storeId,
                    });
                    await newMerchant.save();
                    return {
                        msg: getSuitableTranslations("Approving On This Store And Create Merchant Account Process Has Been Successfully !!", language),
                        error: false,
                        data: {
                            adminId: newMerchant._id,
                            email: store.email,
                            language: store.language
                        },
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Store Is Not Found !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
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

async function followStoreByUser(userId, storeId, language) {
    try {
        const user = await userModel.findById(userId);
        if (user) {
            const store = await storeModel.findById(storeId);
            if (store) {
                if (store.status === "blocking") {
                    return {
                        msg: getSuitableTranslations("Sorry, This Store Is Blocked !!", language),
                        error: true,
                        data: {
                            blockingDate: store.blockingDate,
                            blockingReason: store.blockingReason,
                        },
                    }
                }
                if (store.status === "approving") {
                    if (user.followedStores.includes(storeId)) {
                        return {
                            msg: getSuitableTranslations("Sorry, This Store Is Already Followed By This User !!", language),
                            error: true,
                            data: {},
                        }
                    }
                    await userModel.updateOne({ _id: userId }, { $push: { followedStores: storeId } });
                    return {
                        msg: getSuitableTranslations("Adding New Store To The Followed Stores List By This User Process Has Been Successfully !!", language),
                        error: false,
                        data: {},
                    };
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Store Is Not Found !!", language),
                error: true,
                data: {},
            };
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

async function updateStoreInfo(authorizationId, storeId, newStoreDetails, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const store = await storeModel.findOneAndUpdate({ _id: storeId }, newStoreDetails);
                if (store) {
                    return {
                        msg: getSuitableTranslations("Updating Details Process For This Store Has Been Successfully !!", language),
                        error: false,
                        data: {},
                    };
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Store Is Not Found !!", language),
                    error: true,
                    data: {},
                };
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function blockingStore(authorizationId, storeId, blockingReason, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const store = await storeModel.findById(storeId);
                if (store) {
                    if (store.status === "pending" || store.status === "approving") {
                        await storeModel.updateOne({ _id: storeId }, {
                            blockingReason,
                            blockingDate: Date.now(),
                            status: "blocking"
                        });
                        await adminModel.updateMany({ storeId }, {
                            blockingReason,
                            blockingDate: Date.now(),
                            isBlocked: true
                        });
                        const merchant = await adminModel.findOne({ storeId, isMerchant: true });
                        return {
                            msg: getSuitableTranslations("Blocking Process For This Store Has Been Successfully !!", language),
                            error: false,
                            data: {
                                adminId: merchant._id,
                                email: merchant.email,
                            }
                        }
                    }
                    if (store.status === "blocking") {
                        return {
                            msg: getSuitableTranslations("Sorry, This Store Is Already Blocked !!", language),
                            error: true,
                            data: {},
                        };
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Store Is Not Found !!", language),
                    error: true,
                    data: {},
                };
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function cancelBlockingStore(authorizationId, storeId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const store = await storeModel.findById(storeId);
                if (store) {
                    if (store.status === "blocking") {
                        await storeModel.updateOne({ _id: storeId }, {
                            dateOfCancelBlocking: Date.now(),
                            status: "approving"
                        });
                        await adminModel.updateMany({ storeId }, {
                            dateOfCancelBlocking: Date.now(),
                            isBlocked: false
                        });
                        return {
                            msg: getSuitableTranslations("Cancel Blocking Process For This Store That Has Been Successfully !!", language),
                            error: false,
                            data: {},
                        };
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, This Store Is Not Blocked !!", language),
                        error: true,
                        data: {},
                    };
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Store Is Not Found !!", language),
                    error: true,
                    data: {},
                };
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    } catch (err) {
        throw Error(err);
    }
}

async function changeStoreImage(authorizationId, storeId, newStoreImagePath, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const store = await storeModel.findOneAndUpdate({ _id: storeId }, {
                    imagePath: newStoreImagePath,
                });
                if (store) {
                    return {
                        msg: getSuitableTranslations("Updating Store Image Process Has Been Successfully !!", language),
                        error: false,
                        data: { deletedStoreImagePath: store.imagePath }
                    };
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Store Is Not Exist !!", language),
                    error: true,
                    data: {}
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
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

async function deleteStore(authorizationId, storeId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const store = await storeModel.findOne({ _id: storeId });
                if (store) {
                    if (!store.isMainStore) {
                        await storeModel.deleteOne({ _id: storeId });
                        await categoryModel.deleteMany({ storeId });
                        await productModel.deleteMany({ storeId });
                        const merchant = await adminModel.findOne({ storeId, isMerchant: true });
                        await adminModel.deleteMany({ storeId });
                        return {
                            msg: getSuitableTranslations("Deleting Store Process Has Been Successfully !!", language),
                            error: false,
                            data: {
                                filePaths: [
                                    store.coverImagePath,
                                    store.profileImagePath,
                                    store.commercialRegisterFilePath,
                                    store.taxCardFilePath,
                                    store.addressProofFilePath,
                                ],
                                adminId: merchant._id,
                                email: merchant.email,
                            },
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Permission Denied Because This Store Is Main Store !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Store Is Not Found !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
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

async function rejectStore(authorizationId, storeId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const store = await storeModel.findOneAndDelete({ _id: storeId });
                if (store) {
                    return {
                        msg: getSuitableTranslations("Rejecting Store Process Has Been Successfully !!", language),
                        error: false,
                        data: {
                            filePaths: [
                                store.coverImagePath,
                                store.profileImagePath,
                                store.commercialRegisterFilePath,
                                store.taxCardFilePath,
                                store.addressProofFilePath,
                            ],
                            email: store.email,
                        },
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Store Is Not Found !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied Because This Admin Is Not Website Owner !!", language),
                error: true,
                data: {},
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
    getAllStoresInsideThePage,
    getStoresCount,
    getStoreDetails,
    getMainStoreDetails,
    createNewStore,
    approveStore,
    followStoreByUser,
    updateStoreInfo,
    blockingStore,
    cancelBlockingStore,
    changeStoreImage,
    deleteStore,
    rejectStore,
}