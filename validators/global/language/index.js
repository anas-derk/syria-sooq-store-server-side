const { LANGUAGES } = require("../../../constants/languages");

function isValidLanguage(language) {
    return LANGUAGES.includes(language);
}

module.exports = {
    isValidLanguage
}