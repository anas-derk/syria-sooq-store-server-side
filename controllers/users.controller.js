const { getResponseObject, sendVerificationCodeToUserEmail, sendCongratulationsOnCreatingNewAccountEmail, sendChangePasswordEmail, getSuitableTranslations } = require("../global/functions");

const usersOPerationsManagmentFunctions = require("../models/users.model");

const { sign } = require("jsonwebtoken");

const {
    isBlockingFromReceiveTheCodeAndReceiveBlockingExpirationDate,
    addNewAccountVerificationCode,
    isAccountVerificationCodeValid
} = require("../models/account_codes.model");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "_id") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "email") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "firstName") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "lastName") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "isVerified") filtersObject[objectKey] = Boolean(filters[objectKey]);
    }
    return filtersObject;
}

async function login(req, res) {
    try{
        const { text, password } = req.query;
        const result = await usersOPerationsManagmentFunctions.login(text, password, req.query.language);
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
    catch(err){
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getUserInfo(req, res) {
    try{
        res.json(await usersOPerationsManagmentFunctions.getUserInfo(req.data._id, req.query.language));
    }
    catch(err){
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getUsersCount(req, res) {
    try{
        const result = await usersOPerationsManagmentFunctions.getUsersCount(req.data._id, getFiltersObject(req.query), req.query.language);
        if (result.error) {
            return res.status(401).json(result);
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllUsersInsideThePage(req, res) {
    try{
        const filters = req.query;
        const result = await usersOPerationsManagmentFunctions.getAllUsersInsideThePage(req.data._id, filters.pageNumber, filters.pageSize, getFiltersObject(filters), filters.language);
        if (result.error) {
            return res.status(401).json(result);
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getForgetPassword(req, res) {
    try{
        const { text, language } = req.query;
        let result = await usersOPerationsManagmentFunctions.isExistUserAccount(text, language);
        if (!result.error) {
            if (!result.data.isVerified) {
                return res.json({
                    msg: "Sorry, The Email For This User Is Not Verified !!",
                    error: true,
                    data: result.data,
                });
            }
            result = await isBlockingFromReceiveTheCodeAndReceiveBlockingExpirationDate(text, "to reset password", language);
            if (result.error) {
                return res.json(result);
            }
            result = await sendVerificationCodeToUserEmail(text);
            if (!result.error) {
                return res.json(await addNewAccountVerificationCode(text, result.data, "to reset password", language));
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function createNewUser(req, res) {
    try {
        const { city, text, password } = req.body;
        const { language } = req.query;
        const result = await usersOPerationsManagmentFunctions.createNewUser(city, text, password, language);
        if (result.error) {
            return res.json(result);
        }
        // await sendCongratulationsOnCreatingNewAccountEmail(email, language);
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postAccountVerificationCode(req, res) {
    try{
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
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putUserInfo(req, res) {
    try{
        res.json(await usersOPerationsManagmentFunctions.updateUserInfo(req.data._id, req.body, req.query.language));
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putVerificationStatus(req, res) {
    try{
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
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putResetPassword(req, res) {
    try{
        const { email, code, newPassword, language } = req.query;
        const result = await isAccountVerificationCodeValid(email, code, "to reset password");
        if (!result.error) {
            result = await usersOPerationsManagmentFunctions.resetUserPassword(email, newPassword, language);
            if (!result.error) {
                await sendChangePasswordEmail(email, result.data.language)
            }
            return res.json(result);
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteUser(req, res) {
    try{
        const result = await usersOPerationsManagmentFunctions.deleteUser(req.data._id, req.params.userId, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This User Is Not Found !!") {
                return res.status(401).json(result);
            }
            return res.json(result);
        }
        res.json(result);
    }
    catch(err){
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

module.exports = {
    createNewUser,
    postAccountVerificationCode,
    login,
    getUserInfo,
    getUsersCount,
    getAllUsersInsideThePage,
    getForgetPassword,
    putUserInfo,
    putVerificationStatus,
    putResetPassword,
    deleteUser
}