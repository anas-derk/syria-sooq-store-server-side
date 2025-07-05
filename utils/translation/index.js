function processingTranslation(variablesObject, translation) {
    const variables = Object.keys(variablesObject);
    if (variables.length > 0) {
        variables.forEach((variable) => {
            translation = translation.replace(`{{${variable}}}`, variablesObject[variable]);
        });
        return translation;
    }
    return translation;
}

module.exports = {
    processingTranslation
}