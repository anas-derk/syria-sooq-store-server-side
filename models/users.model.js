// Import User, Account Verification Codes And Product Model Object

const { userModel, accountVerificationCodesModel, adminModel, productsWalletModel, favoriteProductModel, productModel, categoryModel, adsModel, cartModel, mongoose } = require("../models/all.models");

// require bcryptjs module for password encrypting

const { hash, compare } = require("bcryptjs");

// Define Create New User Function

const { getSuitableTranslations } = require("../global/functions");

async function createNewUser(city, fullName, email, mobilePhone, password, language) {
    try {
        const user = await userModel.findOne(email ? { email } : { mobilePhone });
        if (user) {
            return {
                msg: getSuitableTranslations("Sorry, Can't Create New User Because It Is Already Exist !!", language),
                error: true,
                data: {},
            }
        }
        await (new userModel({
            city,
            fullName,
            ...email && { email },
            ...mobilePhone && { mobilePhone },
            password: await hash(password, 10),
        })).save();
        return {
            msg: getSuitableTranslations("Creating New User Process Has Been Successfuly !!", language),
            error: false,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function addNewInterests(userId, interests, language) {
    try {
        const user = await userModel.findById(userId);
        if (user) {
            const existsCategories = await categoryModel.find({ _id: { $in: interests } });
            if (existsCategories.length === 0) {
                return {
                    msg: getSuitableTranslations("Sorry, Please Send At Least One Interest Category !!", language),
                    error: true,
                    data: {},
                }
            }
            if (existsCategories.length < interests.length) {
                for (let category of interests) {
                    let isExistCategory = false;
                    for (let existCategory of existsCategories) {
                        if ((new mongoose.Types.ObjectId(category)).equals(existCategory._id)) {
                            isExistCategory = true;
                            break;
                        }
                    }
                    if (!isExistCategory) {
                        return {
                            msg: getSuitableTranslations("Sorry, Category Id: {{categoryId}} Is Not Exist !!", language, { categoryId: category }),
                            error: true,
                            data: {},
                        }
                    }
                }
            }
            await userModel.updateOne({ _id: userId }, { $push: { existsCategories } });
            return {
                msg: getSuitableTranslations("Adding New Interests Process Has Been Successfully !!", language),
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

async function login(email, mobilePhone, password, language) {
    try {
        const user = await userModel.findOne(email ? { email } : { mobilePhone });
        if (user) {
            if (await compare(password, user.password)) {
                return {
                    msg: getSuitableTranslations("Logining Process Has Been Successfully !!", language),
                    error: false,
                    data: {
                        _id: user._id,
                        isVerified: user.isVerified,
                        city: user.city,
                    },
                };
            }
            return {
                msg: getSuitableTranslations("Sorry, Email Or Password Incorrect !!", language),
                error: true,
                data: {},
            };
        }
        return {
            msg: getSuitableTranslations("Sorry, Email Or Password Incorrect !!", language),
            error: true,
            data: {},
        };
    }
    catch (err) {
        throw Error(err);
    }
}

async function getUserInfo(userId, language) {
    try {
        const user = await userModel.findById(userId);
        if (user) {
            return {
                msg: getSuitableTranslations("Get User Info Process Has Been Successfully !!", language),
                error: false,
                data: user,
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

async function isExistUserAndVerificationEmail(email, language) {
    try {
        const user = await userModel.findOne({ email });
        if (user) {
            if (!user.isVerified) {
                return {
                    msg: getSuitableTranslations("This User Is Exist !!", language),
                    error: false,
                    data: user,
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Email Has Been Verified !!", language),
                error: true,
                data: {},
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

async function getUsersCount(authorizationId, filters, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                return {
                    msg: getSuitableTranslations("Get Users Count Process Has Been Successfully !!", language),
                    error: false,
                    data: await userModel.countDocuments(filters),
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
    } catch (err) {
        throw Error(err);
    }
}

async function getAllUsersInsideThePage(authorizationId, pageNumber, pageSize, filters, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                return {
                    msg: getSuitableTranslations("Get All Users Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
                    error: false,
                    data: await userModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({ dateOfCreation: -1 }),
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
    } catch (err) {
        throw Error(err);
    }
}

async function getMainPageData(authorizationId, language) {
    try {
        const user = await userModel.findById(authorizationId);
        const currentDate = new Date();
        let products = await productModel
            .find({})
            .limit(10)
            .populate("categories").populate("storeId"),
            offers = await productModel
                .find({ startDiscountPeriod: { $lte: currentDate }, endDiscountPeriod: { $gte: currentDate } })
                .limit(10)
                .populate("categories").populate("storeId");
        for (let product of products) {
            product._doc.isFavoriteProductForUser = await favoriteProductModel.findOne({ productId: product._id, userId: authorizationId }) ? true : false;
        }
        for (let product of offers) {
            product._doc.isFavoriteProductForUser = await favoriteProductModel.findOne({ productId: product._id, userId: authorizationId }) ? true : false;
        }
        if (user) {
            return {
                msg: getSuitableTranslations("Get Main Page Data Process Has Been Successfully !!", language),
                error: true,
                data: {
                    categories: await categoryModel.find({ parent: null }).limit(10),
                    ads: {
                        elite: await adsModel.find({ type: "elite" }),
                        panner: await adsModel.find({ type: "panner", city: user.city })
                    },
                    mostPopularCategories: await categoryModel.find({ parent: null }).limit(10),
                    products,
                    offers,
                    cartLength: await cartModel.countDocuments({ userId: authorizationId }),
                },
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

async function isExistUserAccount(email, mobilePhone, language) {
    try {
        const user = await userModel.findOne(email ? { email } : { mobilePhone });
        if (user) {
            return {
                msg: getSuitableTranslations("User Is Exist !!", language),
                error: false,
                data: {
                    _id: user._id,
                    isVerified: user.isVerified,
                },
            }
        }
        const admin = await adminModel.findOne(email ? { email } : { mobilePhone });
        if (admin) {
            return {
                msg: getSuitableTranslations("Admin Is Exist !!", language),
                error: false,
                data: {
                    _id: admin._id,
                },
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

async function updateUserInfo(userId, newUserData, language) {
    try {
        const userInfo = await userModel.findById(userId);
        if (userInfo) {
            let newUserInfo = newUserData;
            if (newUserData.email && newUserData.email !== userInfo.email) {
                const user = await userModel.findOne({ email: newUserData.email });
                if (user) {
                    return {
                        msg: getSuitableTranslations("Sorry, This Email Is Already Exist !!", language),
                        error: true,
                        data: {},
                    }
                }
            }
            await userModel.updateOne({ _id: userId }, newUserInfo);
            return {
                msg: getSuitableTranslations("Updating User Info Process Has Been Successfuly !!", language),
                error: false,
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

async function updateVerificationStatus(text, language) {
    try {
        const userInfo = await userModel.findOneAndUpdate({ text }, { isVerified: true });
        if (userInfo) {
            await accountVerificationCodesModel.deleteOne({ text, typeOfUse: "to activate account" });
            return {
                msg: getSuitableTranslations("Updating Verification Status Process Has Been Successfully !!", language),
                error: false,
                data: {
                    _id: userInfo._id,
                    isVerified: userInfo.isVerified,
                },
            };
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        };
    }
    catch (err) {
        throw Error(err);
    }
}

async function resetUserPassword(email, mobilePhone, newPassword, language) {
    try {
        const user = await userModel.findOneAndUpdate(email ? { email } : { mobilePhone }, { password: await hash(newPassword, 10) });
        if (user) {
            return {
                msg: getSuitableTranslations("Reseting Password Process Has Been Successfully !!", language),
                error: false,
                data: {},
            };
        }
        const admin = await adminModel.findOneAndUpdate(email ? { email } : { mobilePhone }, { password: await hash(newPassword, 10) });
        if (admin) {
            return {
                msg: getSuitableTranslations("Reseting Password Process Has Been Successfully !!", language),
                error: false,
                data: {},
            };
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

async function changeUserImage(authorizationId, newUserImagePath, language) {
    try {
        const user = await userModel.findOneAndUpdate({ _id: authorizationId }, { imagePath: newUserImagePath });
        if (user) {
            return {
                msg: getSuitableTranslations("Updating User Image Process Has Been Successfully !!", language),
                error: false,
                data: { deletedUserImagePath: user.imagePath }
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

async function deleteUser(authorizationId, userId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin) {
            if (admin.isWebsiteOwner) {
                const user = await userModel.findOneAndDelete({ _id: userId });
                if (user) {
                    await productsWalletModel.deleteMany({ userId });
                    await favoriteProductModel.deleteMany({ userId });
                    return {
                        msg: getSuitableTranslations("Deleting User Process Has Been Successfully !!", language),
                        error: false,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
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
    createNewUser,
    addNewInterests,
    login,
    getUserInfo,
    isExistUserAccount,
    isExistUserAndVerificationEmail,
    getUsersCount,
    getAllUsersInsideThePage,
    getMainPageData,
    updateUserInfo,
    updateVerificationStatus,
    resetUserPassword,
    changeUserImage,
    deleteUser
}