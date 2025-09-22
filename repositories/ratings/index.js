// Import User, Product Model And Products Rating Model  Object

const { userModel, productModel, ratingModel, storeModel } = require("../../models");

const { getSuitableTranslations } = require("../../helpers/translation");

async function selectRating(userId, ratingInfo, language) {
    try {
        const user = await userModel.findById(userId);
        if (user) {
            if (ratingInfo.type === "app") {
                await ratingModel.updateOne({ userId, type: ratingInfo.type }, { rating: ratingInfo.rating, ...ratingInfo.notes && { notes: ratingInfo.notes } }, { upsert: true });
                return {
                    msg: getSuitableTranslations("Updating App Rating By This User Process Has Been Successfully !!", language),
                    error: false,
                    data: {},
                }
            }
            const info = ratingInfo.type === "product" ? await productModel.findById(ratingInfo.id) : await storeModel.findById(ratingInfo.id);
            if (info) {
                const ratingDetails = await ratingModel.findOne({ userId, id: ratingInfo.id, type: ratingInfo.type });
                if (ratingDetails) {
                    await ratingModel.updateOne({ userId, id: ratingInfo.id, type: ratingInfo.type }, { rating: ratingInfo.rating });
                    info.ratings[ratingDetails.rating] = info.ratings[ratingDetails.rating] - 1;
                    info.ratings[ratingInfo.rating] = info.ratings[ratingInfo.rating] + 1;
                    if (ratingInfo.type === "product") {
                        await productModel.updateOne({ _id: ratingInfo.id }, { ratings: info.ratings });
                    } else {
                        await storeModel.updateOne({ _id: ratingInfo.id }, { ratings: info.ratings });
                    }
                    return {
                        msg: getSuitableTranslations(`Updating ${ratingInfo.type.replace(ratingInfo.type[0], ratingInfo.type[0].toUpperCase())} Rating By This User Process Has Been Successfully !!`, language),
                        error: false,
                        data: {},
                    }
                }
                await (new ratingModel({
                    userId,
                    id: ratingInfo.id,
                    type: ratingInfo.type,
                    rating: ratingInfo.rating
                })).save();
                info.ratings[ratingInfo.rating] = info.ratings[ratingInfo.rating] + 1;
                if (ratingInfo.type === "product") {
                    await productModel.updateOne({ _id: ratingInfo.id }, { ratings: info.ratings });
                } else {
                    await storeModel.updateOne({ _id: ratingInfo.id }, { ratings: info.ratings });
                }
                return {
                    msg: getSuitableTranslations(`Adding New ${ratingInfo.type.replace(ratingInfo.type[0], ratingInfo.type[0].toUpperCase())} Rating By This User Process Has Been Successfully !!`, language),
                    error: false,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations(`Sorry, This ${ratingInfo.type.replace(ratingInfo.type[0], ratingInfo.type[0].toUpperCase())} Is Not Found !!`, language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, The User Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getRatingByUserId(userId, id, type, language) {
    try {
        const user = await userModel.findById(userId);
        if (user) {
            const info = type === "product" ? await productModel.findById(id) : await storeModel.findById(id);
            if (info) {
                const ratingInfo = await ratingModel.findOne({ userId, id, type });
                if (ratingInfo) {
                    return {
                        msg: getSuitableTranslations(`Get ${type.replace(type[0], type[0].toUpperCase())} Rating By User Process Has Been Successfully !!`, language),
                        error: false,
                        data: ratingInfo.rating,
                    }
                }
                return {
                    msg: getSuitableTranslations(`Sorry, This ${type.replace(type[0], type[0].toUpperCase())} Is Not Exist Any Rating By This User !!`, language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations(`Sorry, This ${type.replace(type[0], type[0].toUpperCase())} Is Not Found !!`, language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, The User Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    selectRating,
    getRatingByUserId
}