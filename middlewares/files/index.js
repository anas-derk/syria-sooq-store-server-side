const { getResponseObject } = require("../../helpers/responses");

function validateIsExistErrorInFiles(req, res, next) {
    const uploadError = req.uploadError;
    if (uploadError) {
        res.status(400).json(getResponseObject(uploadError, true, {}));
        return;
    }
    next();
}

module.exports = {
    validateIsExistErrorInFiles,
}