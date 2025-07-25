const { responsesHelpers, translationHelpers, processingHelpers, emailsHelpers } = require("../../helpers");

const { getResponseObject } = responsesHelpers;

const { getSuitableTranslations } = translationHelpers;

const { imagesHelpers } = processingHelpers;

const { handleResizeImagesAndConvertFormatToWebp } = imagesHelpers;

const {
    sendVerificationCodeToUserEmail,
    sendCongratulationsOnCreatingNewAccountEmail,
    sendChangePasswordEmail
} = emailsHelpers;

const usersOPerationsManagmentFunctions = require("../../repositories/users");

const { sign } = require("jsonwebtoken");

const {
    isBlockingFromReceiveTheCodeAndReceiveBlockingExpirationDate,
    addNewAccountVerificationCode,
    isAccountVerificationCodeValid
} = require("../../repositories/verification_codes");

const { unlinkSync } = require("fs");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "_id") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "email") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "fullName") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "isVerified") filtersObject[objectKey] = Boolean(filters[objectKey]);
    }
    return filtersObject;
}

async function login(req, res) {
    try {
        const { email, mobilePhone, password } = req.query;
        const result = await usersOPerationsManagmentFunctions.login(email, mobilePhone, password, req.query.language);
        if (!result.error) {
            res.json({
                msg: result.msg,
                error: result.error,
                data: {
                    ...result.data,
                    token: sign(result.data, process.env.secretKey, {
                        expiresIn: "7d",
                    }),
                },
            });
            return;
        }
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getUserInfo(req, res) {
    try {
        res.json(await usersOPerationsManagmentFunctions.getUserInfo(req.data._id, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getUsersCount(req, res) {
    try {
        const result = await usersOPerationsManagmentFunctions.getUsersCount(req.data._id, getFiltersObject(req.query), req.query.language);
        if (result.error) {
            return res.status(401).json(result);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllUsersInsideThePage(req, res) {
    try {
        const filters = req.query;
        const result = await usersOPerationsManagmentFunctions.getAllUsersInsideThePage(req.data._id, filters.pageNumber, filters.pageSize, getFiltersObject(filters), filters.language);
        if (result.error) {
            return res.status(401).json(result);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getForgetPassword(req, res) {
    try {
        const { email, mobilePhone, language } = req.query;
        let result = await usersOPerationsManagmentFunctions.isExistUserAccount(email, mobilePhone, language);
        if (!result.error) {
            if (!result.data.isVerified) {
                return res.json({
                    msg: "Sorry, The Email For This User Is Not Verified !!",
                    error: true,
                    data: result.data,
                });
            }
            result = await isBlockingFromReceiveTheCodeAndReceiveBlockingExpirationDate(email, mobilePhone, "to reset password", language);
            if (result.error) {
                return res.json(result);
            }
            result = await sendVerificationCodeToUserEmail(email);
            if (!result.error) {
                return res.json(await addNewAccountVerificationCode(email, mobilePhone, result.data, "to reset password", language));
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getMainPageData(req, res) {
    try {
        res.json(await usersOPerationsManagmentFunctions.getMainPageData(req.data._id, req.query.language));
    }
    catch (err) {
        console.log(err);
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function createNewUser(req, res) {
    try {
        const { city, fullName, email, mobilePhone, password } = req.body;
        const { language } = req.query;
        const result = await usersOPerationsManagmentFunctions.createNewUser(city, fullName, email, mobilePhone, password, language);
        if (result.error) {
            return res.json(result);
        }
        if (email) {
            await sendCongratulationsOnCreatingNewAccountEmail(email, "ar");
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postAddNewInterests(req, res) {
    try {
        res.json(await usersOPerationsManagmentFunctions.addNewInterests(req.data._id, req.body.interests, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postAccountVerificationCode(req, res) {
    try {
        const { email, typeOfUse, language } = req.query;
        let result = typeOfUse === "to activate account" ? await usersOPerationsManagmentFunctions.isExistUserAndVerificationEmail(email, language) : usersOPerationsManagmentFunctions.isExistUserAccount(email, language);
        if (!result.error) {
            result = await isBlockingFromReceiveTheCodeAndReceiveBlockingExpirationDate(email, typeOfUse, language);
            if (result.error) {
                return res.json(result);
            }
            result = await sendVerificationCodeToUserEmail(email);
            if (!result.error) {
                return res.json(await addNewAccountVerificationCode(email, result.data, typeOfUse, language));
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putUserInfo(req, res) {
    try {
        res.json(await usersOPerationsManagmentFunctions.updateUserInfo(req.data._id, req.body, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putVerificationStatus(req, res) {
    try {
        const { email, code, language } = req.query;
        let result = await isAccountVerificationCodeValid(email, code, "to activate account", language);
        if (!result.error) {
            result = await usersOPerationsManagmentFunctions.updateVerificationStatus(email, language);
            if (!result.error) {
                return res.json({
                    msg: result.msg,
                    error: result.error,
                    data: {
                        ...result.data,
                        token: sign(result.data, process.env.secretKey, {
                            expiresIn: "7d",
                        }),
                    },
                });
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putResetPassword(req, res) {
    try {
        const { email, mobilePhone, code, newPassword, language } = req.query;
        let result = await isAccountVerificationCodeValid(email, mobilePhone, code, "to reset password", language);
        if (!result.error) {
            result = await usersOPerationsManagmentFunctions.resetUserPassword(email, mobilePhone, newPassword, language);
            if (!result.error) {
                if (email) {
                    await sendChangePasswordEmail(email, "ar");
                }
            }
            return res.json(result);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putUserImage(req, res) {
    try {
        const outputImageFilePath = `assets/images/users/${Math.random()}_${Date.now()}__${req.file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`;
        await handleResizeImagesAndConvertFormatToWebp([req.file.buffer], [outputImageFilePath]);
        const result = await usersOPerationsManagmentFunctions.changeUserImage(req.data._id, outputImageFilePath, req.query.language);
        if (!result.error) {
            const oldUserImagePath = result.data.deletedUserImagePath;
            if (oldUserImagePath) {
                unlinkSync(oldUserImagePath);
            }
            res.json({
                ...result,
                data: {
                    newImagePath: outputImageFilePath,
                }
            });
        } else {
            unlinkSync(outputImageFilePath);
            if (result.msg === "Sorry, This User Is Not Exist !!") {
                return res.status(401).json(result);
            }
            return res.json(result);
        }
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteUser(req, res) {
    try {
        const { userType, userId } = req.query;
        const result = await usersOPerationsManagmentFunctions.deleteUser(req.data._id, userType, userId, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This User Is Not Found !!") {
                return res.status(401).json(result);
            }
            return res.json(result);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

module.exports = {
    createNewUser,
    postAddNewInterests,
    postAccountVerificationCode,
    login,
    getUserInfo,
    getUsersCount,
    getAllUsersInsideThePage,
    getForgetPassword,
    getMainPageData,
    putUserInfo,
    putVerificationStatus,
    putResetPassword,
    putUserImage,
    deleteUser
}