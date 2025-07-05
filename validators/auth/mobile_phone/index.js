function isValidMobilePhone(mobilePhone) {
    return /^(093|099|098|094|095|096)\d{7}$/.test(mobilePhone);
}

module.exports = {
    isValidMobilePhone,
}