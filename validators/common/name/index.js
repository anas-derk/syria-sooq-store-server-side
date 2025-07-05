function isValidName(name) {
    return /^([\u0600-\u06FF\s]+|[a-zA-Z\s]+)$/.test(name);
}

module.exports = {
    isValidName
}