const { getResponseObject } = require("../../helpers/responses");

const { Types } = require("mongoose");

function getDataTypesAsText(dataTypes) {
    return dataTypes.map((dataType, index) => dataType + (index !== dataTypes.length - 1 ? " Or " : ""));
}

function checkIsExistValueForFieldsAndDataTypes(fieldNamesAndValuesAndDataTypes) {
    for (let fieldnameAndValueAndDataType of fieldNamesAndValuesAndDataTypes) {
        if (fieldnameAndValueAndDataType.isRequiredValue) {
            if (fieldnameAndValueAndDataType.dataTypes.includes("array")) {
                if (Array.isArray(fieldnameAndValueAndDataType.fieldValue)) {
                    if (fieldnameAndValueAndDataType.fieldValue.length === 0) {
                        return getResponseObject(
                            `Invalid Request, Please Send ${fieldnameAndValueAndDataType.fieldName} Value !!`,
                            true,
                            {}
                        );
                    }
                }
                else return getResponseObject(
                    `Invalid Request, Please Fix Type Of ${fieldnameAndValueAndDataType.fieldName} ( Required: ${getDataTypesAsText(fieldnameAndValueAndDataType.dataTypes)} ) !!`,
                    true,
                    {}
                );
            }
            if (!fieldnameAndValueAndDataType.fieldValue) {
                return getResponseObject(
                    `Invalid Request, Please Send ${fieldnameAndValueAndDataType.fieldName} Value !!`,
                    true,
                    {}
                );
            }
        }
        if (fieldnameAndValueAndDataType.fieldValue) {
            let isExistTruthDataType = false;
            for (let dataType of fieldnameAndValueAndDataType.dataTypes) {
                if (dataType === "number" && !isNaN(fieldnameAndValueAndDataType.fieldValue)) {
                    isExistTruthDataType = true;
                    break;
                }
                if (dataType === "ObjectId" && Types.ObjectId.isValid(fieldnameAndValueAndDataType.fieldValue)) {
                    isExistTruthDataType = true;
                    break;
                }
                if (dataType === "array" && Array.isArray(fieldnameAndValueAndDataType.fieldValue)) {
                    isExistTruthDataType = true;
                    break;
                }
                if (dataType === typeof fieldnameAndValueAndDataType.fieldValue) {
                    isExistTruthDataType = true;
                }
            }
            if (!isExistTruthDataType) {
                return getResponseObject(
                    `Invalid Request, Please Fix Type Of ${fieldnameAndValueAndDataType.fieldName} ( Required: ${getDataTypesAsText(fieldnameAndValueAndDataType.dataTypes)} ) !!`,
                    true,
                    {}
                );
            }
        }
    }
    return getResponseObject("Success In Check Is Exist Value For Fields And Data Types !!", false, {});
}

module.exports = {
    getDataTypesAsText,
    checkIsExistValueForFieldsAndDataTypes,
}