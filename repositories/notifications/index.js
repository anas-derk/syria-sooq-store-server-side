// Import User Model Object

const { userModel } = require("../../models");

const { getSuitableTranslations } = require("../../helpers/translation");

// Define Register Token Function

async function registerToken(userId, token, language) {
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return {
                msg: getSuitableTranslations("Sorry, Can't Register New Token Because This User Is Not Exist !!", language),
                error: true,
                data: {},
            }
        }
        await userModel.updateOne({ _id: userId }, { notificationsToken: token });
        return {
            msg: getSuitableTranslations("Register New Token Process Has Been Successfuly !!", language),
            error: false,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    registerToken,
}