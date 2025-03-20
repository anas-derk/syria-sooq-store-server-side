const {
    getResponseObject,
    sendApproveStoreEmail,
    sendRejectStoreEmail,
    sendBlockStoreEmail,
    sendDeleteStoreEmail,
    sendConfirmRequestAddStoreArrivedEmail,
    sendReceiveAddStoreRequestEmail,
    handleResizeImagesAndConvertFormatToWebp,
    getSuitableTranslations
} = require("../global/functions");

const storesOPerationsManagmentFunctions = require("../models/stores.model");

const { unlinkSync } = require("fs");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "_id") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "name") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "status") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "ownerFullName") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "email") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function getStoresCount(req, res) {
    try {
        const result = await storesOPerationsManagmentFunctions.getStoresCount(req.query._id, getFiltersObject(req.query), req.query.language);
        if (result.error) {
            return res.status(401).json(result);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllStoresInsideThePage(req, res) {
    try {
        const filters = req.query;
        const result = await storesOPerationsManagmentFunctions.getAllStoresInsideThePage(req.data._id, filters.pageNumber, filters.pageSize, getFiltersObject(filters), filters.language);
        if (result.error) {
            return res.status(401).json(result);
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getStoreDetails(req, res) {
    try {
        res.json(await storesOPerationsManagmentFunctions.getStoreDetails(req.data._id, req.params.storeId, req.query.userType, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getMainStoreDetails(req, res) {
    try {
        res.json(await storesOPerationsManagmentFunctions.getMainStoreDetails(req.data._id, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postNewStore(req, res) {
    try {
        const storeFiles = Object.assign({}, req.files);
        console.log(storeFiles);
        let bufferFiles = [
            storeFiles.coverImage[0].buffer,
            storeFiles.profileImage[0].buffer,
            storeFiles.commercialRegisterFile[0].buffer,
            storeFiles.taxCardFile[0].buffer,
            storeFiles.addressProofFile[0].buffer,
        ], outputImageFilePaths = [
            `assets/images/stores/cover/${Math.random()}_${Date.now()}__${storeFiles.coverImage[0].originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`,
            `assets/images/stores/profile/${Math.random()}_${Date.now()}__${storeFiles.profileImage[0].originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`,
            `assets/images/stores/commercial_register/${Math.random()}_${Date.now()}__${storeFiles.commercialRegisterFile[0].originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`,
            `assets/images/stores/tax_card/${Math.random()}_${Date.now()}__${storeFiles.taxCardFile[0].originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`,
            `assets/images/stores/address_proof/${Math.random()}_${Date.now()}__${storeFiles.addressProofFile[0].originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`,
        ];
        await handleResizeImagesAndConvertFormatToWebp(bufferFiles, outputImageFilePaths);
        const result = await storesOPerationsManagmentFunctions.createNewStore({
            adminId: req.data._id,
            ...Object.assign({}, req.body),
            coverImagePath: outputImageFilePaths[0],
            profileImagePath: outputImageFilePaths[1],
            commercialRegisterFilePath: outputImageFilePaths[2],
            taxCardFilePath: outputImageFilePaths[3],
            addressProofFilePath: outputImageFilePaths[4],
        }, req.query.language);
        if (result.error) {
            for (let filePath of outputImageFilePaths) {
                unlinkSync(filePath);
            }
        }
        else {
            try {
                await sendConfirmRequestAddStoreArrivedEmail(result.data.email, "ar");
                await sendReceiveAddStoreRequestEmail(process.env.BUSSINESS_EMAIL, result.data);
            } catch (err) {
                console.log(err);
            }
        }
        res.json(result);
    }
    catch (err) {
        console.log(err)
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postApproveStore(req, res) {
    try {
        const result = await storesOPerationsManagmentFunctions.approveStore(req.data._id, req.params.storeId, req.query.password, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied Because This Admin Is Not Website Owner !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                return res.status(401).json(result);
            }
            return res.json(result);
        }
        res.json(await sendApproveStoreEmail(result.data.email, req.query.password, result.data.adminId, req.params.storeId, "ar"));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postFollowStoreByUser(req, res) {
    try {
        const result = await storesOPerationsManagmentFunctions.followStoreByUser(req.data._id, req.params.storeId, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, This User Is Not Exist !!") {
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

async function putStoreInfo(req, res) {
    try {
        const result = await storesOPerationsManagmentFunctions.updateStoreInfo(req.data._id, req.params.storeId, req.body, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Store Is Not Found !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putBlockingStore(req, res) {
    try {
        const result = await storesOPerationsManagmentFunctions.blockingStore(req.data._id, req.params.storeId, req.query.blockingReason, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied Because This Admin Is Not Website Owner !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                return res.status(401).json(result);
            }
            return res.json(result);
        }
        res.json(await sendBlockStoreEmail(result.data.email, result.data.adminId, req.params.storeId, "ar"));
    }
    catch (err) {
        console.log(err);
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putCancelBlockingStore(req, res) {
    try {
        const result = await storesOPerationsManagmentFunctions.cancelBlockingStore(req.data._id, req.params.storeId, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied Because This Admin Is Not Website Owner !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putStoreImage(req, res) {
    try {
        const outputImageFilePath = `assets/images/stores/${Math.random()}_${Date.now()}__${req.file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`;
        await handleResizeImagesAndConvertFormatToWebp([req.file.buffer], [outputImageFilePath]);
        const result = await storesOPerationsManagmentFunctions.changeStoreImage(req.data._id, req.params.storeId, outputImageFilePath, req.query.language);
        if (!result.error) {
            unlinkSync(result.data.deletedStoreImagePath);
            res.json({
                ...result,
                data: {
                    newStoreImagePath: outputImageFilePath,
                }
            });
        } else {
            unlinkSync(outputImageFilePath);
            if (result.msg === "Sorry, Permission Denied Because This Admin Is Not Website Owner !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                return res.status(401).json(result);
            }
            return res.json(result);
        }
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteStore(req, res) {
    try {
        const result = await storesOPerationsManagmentFunctions.deleteStore(req.data._id, req.params.storeId, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Store Is Not Found !!") {
                return res.status(401).json(result);
            }
            return res.json(result);
        }
        for (let filePath of result.data.filePaths) {
            unlinkSync(filePath);
        }
        res.json(await sendDeleteStoreEmail(result.data.email, result.data.adminId, req.params.storeId, "ar"));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteRejectStore(req, res) {
    try {
        const result = await storesOPerationsManagmentFunctions.rejectStore(req.data._id, req.params.storeId, req.query.language);
        if (result.error) {
            if (result.msg !== "Sorry, This Store Is Not Found !!") {
                return res.status(401).json(result);
            }
            return res.json(result);
        }
        for (let filePath of result.data.filePaths) {
            unlinkSync(filePath);
        }
        res.json(await sendRejectStoreEmail(result.data.email, "ar"));
    }
    catch (err) {
        console.log(err);
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

module.exports = {
    getAllStoresInsideThePage,
    getStoresCount,
    getStoreDetails,
    getMainStoreDetails,
    postNewStore,
    postApproveStore,
    postFollowStoreByUser,
    putStoreInfo,
    putBlockingStore,
    putStoreImage,
    putCancelBlockingStore,
    deleteStore,
    deleteRejectStore,
}