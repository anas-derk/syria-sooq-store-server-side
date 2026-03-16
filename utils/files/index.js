const crypto = require("crypto");

function generateSafeFileName(originalName) {
    let baseName = originalName
        .replace(/\.[^/.]+$/, "")
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9._()-]/g, "")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "");
    if (!baseName) baseName = "file";
    const ext = originalName.split(".").pop().toLowerCase();
    const uniqueName = `${crypto.randomUUID()}__${baseName}`;
    const uniqueNameWithExt = `${uniqueName}.${ext}`;
    return {
        baseName,
        ext,
        uniqueName,
        uniqueNameWithExt
    };
}

module.exports = {
    generateSafeFileName
}