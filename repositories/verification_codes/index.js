const { verificationCodeModel } = require("../../models");

const { hash, compare } = require("bcryptjs");

const { getSuitableTranslations } = require("../../helpers/translation");

async function addNewAccountVerificationCode(email, mobilePhone, code, typeOfUse, language) {
    try {
        const creatingDate = new Date(Date.now());
        const expirationDate = new Date(creatingDate.getTime() + 24 * 60 * 60 * 1000);
        const accountVerificationCode = await verificationCodeModel.findOne(email ? { email, typeOfUse } : { mobilePhone, typeOfUse });
        if (accountVerificationCode) {
            const newRequestTimeCount = accountVerificationCode.requestTimeCount + 1;
            await verificationCodeModel.updateOne(email ? { email, typeOfUse } : { mobilePhone, typeOfUse },
                {
                    code: await hash(code, 10),
                    requestTimeCount: newRequestTimeCount,
                    createdDate: creatingDate,
                    expirationDate: expirationDate,
                    isBlockingFromReceiveTheCode: newRequestTimeCount >= 5 ? true : false,
                    receiveBlockingExpirationDate:
                        newRequestTimeCount >= 5 ? expirationDate : accountVerificationCode.receiveBlockingExpirationDate,
                }
            );
            return {
                msg: getSuitableTranslations("Sending Code To Your Email Process Has Been Succssfuly !!", language),
                error: false,
                data: {},
            }
        }
        await (new verificationCodeModel({
            ...email && { email },
            ...mobilePhone && { mobilePhone },
            code: await hash(code, 10),
            createdDate: creatingDate,
            expirationDate: expirationDate,
            typeOfUse
        })).save();
        return {
            msg: getSuitableTranslations("Sending Code To Your Email Process Has Been Succssfuly !!", language),
            error: false,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function isAccountVerificationCodeValid(email, mobilePhone, code, typeOfUse, language) {
    try {
        const accountVerificationCode = await verificationCodeModel.findOne(email ? { email, typeOfUse } : { mobilePhone, typeOfUse });
        if (accountVerificationCode) {
            if (await compare(code, accountVerificationCode.code)) {
                return {
                    msg: getSuitableTranslations("This Code For This Email Is Valid !!", language),
                    error: false,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("This Code For This Email Is Not Valid !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Found !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function isBlockingFromReceiveTheCodeAndReceiveBlockingExpirationDate(email, mobilePhone, typeOfUse, language) {
    try {
        const accountVerificationCode = await verificationCodeModel.findOne(email ? { email, typeOfUse } : { mobilePhone, typeOfUse });
        if (accountVerificationCode) {
            const currentDate = new Date(Date.now());
            if (
                accountVerificationCode.isBlockingFromReceiveTheCode &&
                currentDate < accountVerificationCode.receiveBlockingExpirationDate
            ) {
                return {
                    msg: getSuitableTranslations("Sorry, This Email Has Been Blocked From Receiving Code Messages For 24 Hours Due To Exceeding The Maximum Number Of Resend Attempts !!", language),
                    error: true,
                    data: {
                        receiveBlockingExpirationDate: accountVerificationCode.receiveBlockingExpirationDate,
                    },
                }
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, There Is No Code For This Email !!", language),
            error: false,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    addNewAccountVerificationCode,
    isAccountVerificationCodeValid,
    isBlockingFromReceiveTheCodeAndReceiveBlockingExpirationDate,
}