const { join } = require("path");

const PUBLIC_PATH = join(__dirname, "..", "..", "assets");
const UPLOAD_PATH = join(PUBLIC_PATH, "images");

module.exports = {
    PUBLIC_PATH,
    UPLOAD_PATH
}