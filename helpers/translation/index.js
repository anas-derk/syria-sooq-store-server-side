const { translationUtils } = require("../../utils");

const arTranslations = require("../../locals/ar/index.json");

function getSuitableTranslations(msg, language, variables = {}) {
    if (language) {
        switch (language) {
            case "ar": return translationUtils.processingTranslation(variables, arTranslations[msg] ? arTranslations[msg] : msg);
            default: return translationUtils.processingTranslation(variables, msg);
        }
    }
    return {
        en: translationUtils.processingTranslation(variables, msg),
        ar: translationUtils.processingTranslation(variables, arTranslations[msg] ? arTranslations[msg] : msg),
    }
}

module.exports = {
    getSuitableTranslations
}