const sharp = require("sharp");

async function handleResizeImagesAndConvertFormatToWebp(files, outputImageFilePaths) {
    try {
        for (let i = 0; i < files.length; i++) {
            await sharp(files[i], {
                failOn: "none"
            })
                .withMetadata()
                .rotate()
                .resize({
                    width: 550,
                })
                .toFormat("webp", {
                    quality: 100
                })
                .toFile(outputImageFilePaths[i]);
        }
    }
    catch (err) {
        throw err;
    }
}

module.exports = {
    handleResizeImagesAndConvertFormatToWebp
}