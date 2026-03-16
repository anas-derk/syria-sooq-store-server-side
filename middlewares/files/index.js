const { getResponseObject } = require("../../helpers/responses");

const { unlinkSync } = require("fs");

let fileTypeFromFileFunc, fileTypeFromBufferFunc;

(async () => {
    const { fileTypeFromFile, fileTypeFromBuffer } = await import("file-type");
    fileTypeFromFileFunc = fileTypeFromFile;
    fileTypeFromBufferFunc = fileTypeFromBuffer;
})();

function validateIsExistErrorInFiles(req, res, next) {
    const uploadError = req.uploadError;
    if (uploadError) {
        res.status(400).json(getResponseObject(uploadError, true, {}));
        return;
    }
    next();
}

async function validateRealFilesType(req, res, next) {
    try {
        let files = [];
        // single
        if (req.file) {
            files = [req.file];
        }
        // array
        else if (Array.isArray(req.files)) {
            files = req.files;
        }
        // fields
        else if (req.files && typeof req.files === "object") {
            files = Object.values(req.files).flat();
        }
        if (!files.length) {
            return res.status(400).json(
                getResponseObject("Sorry, Files is required !!", true, {})
            );
        }
        for (const file of files) {
            const fileType = req.storageType === "memory"
                ? await fileTypeFromBufferFunc(file.buffer)
                : await fileTypeFromFileFunc(file.path);

            if (!fileType || !req.allowedMimeTypes.includes(fileType.mime)) {
                if (req.storageType !== "memory" && file.path) {
                    try {
                        unlinkSync(file.path);
                    } catch (_) { }
                }
                return res.status(400).json(
                    getResponseObject(`Sorry, Invalid Real File Type (${file.originalname}) !!`, true, {})
                );
            }
        }
        next();
    } catch (err) {
        return res.status(500).json(
            getResponseObject("Internal Server Error When Verify Real File / Files Type !!", true, {})
        );
    }
}

module.exports = {
    validateIsExistErrorInFiles,
    validateRealFilesType
}