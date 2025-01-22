const { Types } = require("mongoose");

const { getPasswordForBussinessEmail } = require("../models/global_passwords.model");

const { createTransport } = require("nodemailer");

const CodeGenerator = require("node-code-generator");

const { join } = require("path");

const { readFileSync } = require("fs");

const { compile } = require("ejs");

const sharp = require("sharp");

const arTranslations = require("./translations/ar.json");

function isEmail(email) {
    return email.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
}

function isValidPassword(password) {
    return password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
}

function isValidName(name) {
    return name.match(/^([\u0600-\u06FF\s]+|[a-zA-Z\s]+)$/);
}

function isValidMobilePhone(mobilePhone) {
    return mobilePhone.match(/^(093|099|098|094|095|096)\d{7}$/);
}

function isValidLanguage(language) {
    return ["ar", "en"].includes(language);
}

function calcOrderAmount(products) {
    let newOrderAmount = 0;
    for (let i = 0; i < products.length; i++) {
        newOrderAmount += products[i].totalAmount;
    }
    return newOrderAmount;
}

function transporterObj(bussinessEmailPassword) {
    const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.BUSSINESS_EMAIL,
            pass: bussinessEmailPassword,
        },
        tls: {
            ciphers: "SSLv3",
        },
    });
    return transporter;
}

async function sendVerificationCodeToUserEmail(email) {
    const result = await getPasswordForBussinessEmail(process.env.BUSSINESS_EMAIL);
    if (!result.error) {
        const generator = new CodeGenerator();
        const generatedCode = generator.generateCodes("####")[0];
        const templateContent =  readFileSync(join(__dirname, "..", "assets", "email_templates", "email_template.ejs"), "utf-8");
        const compiledTemplate = compile(templateContent);
        const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate({ generatedCode });
        const mailConfigurations = {
            from: `Syria Sooq <${process.env.BUSSINESS_EMAIL}>`,
            to: email,
            subject: "رمز التحقق من الحساب على Syria Sooq",
            html: htmlContentAfterCompilingEjsTemplateFile,
        };
        return new Promise((resolve, reject) => {
            transporterObj(result.data).sendMail(mailConfigurations, function (error, info) {
                if (error) reject(error);
                resolve({
                    msg: "Sending Confirmation Code Process Has Been Successfully !!",
                    error: false,
                    data: generatedCode,
                });
            });
        });
    }
    return result;
}

async function sendApproveStoreEmail(email, password, adminId, storeId, language) {
    const result = await getPasswordForBussinessEmail(process.env.BUSSINESS_EMAIL);
    if (!result.error) {
        const templateContent =  readFileSync(join(__dirname, "..", "assets", "email_templates", "accept_add_store_request.ejs"), "utf-8");
        const compiledTemplate = compile(templateContent);
        const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate({ password, adminId, storeId, language });
        return new Promise((resolve, reject) => {
            transporterObj(result.data).sendMail({
                from: `Ubuyblues <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: "Approve The Store Addition Request At Ubuyblues",
                html: htmlContentAfterCompilingEjsTemplateFile,
            }, function (error, info) {
                if (error) reject(error);
                resolve({
                    msg: "Sending Approve Email On Store Process Has Been Successfully !!",
                    error: false,
                    data: {},
                });
            });
        });
    }
    return result;
}

async function sendCongratulationsOnCreatingNewAccountEmail(email, language) {
    const result = await getPasswordForBussinessEmail(process.env.BUSSINESS_EMAIL);
    if (!result.error) {
        const templateContent = readFileSync(join(__dirname, "..", "assets", "email_templates", "congratulations_creating_new_account.ejs"), "utf-8");
        const compiledTemplate = compile(templateContent);
        const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate({ email, language });
        return new Promise((resolve, reject) => {
            transporterObj(result.data).sendMail({
                from: `Ubuyblues <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: "Welcome Message From Ubuyblues",
                html: htmlContentAfterCompilingEjsTemplateFile,
            }, function (error, info) {
                if (error) reject(error);
                resolve({
                    msg: "Sending Congratulations Email To User Process Has Been Successfully !!",
                    error: false,
                    data: {},
                });
            });
        });
    }
    return result;
}

async function sendRejectStoreEmail(email, language) {
    const result = await getPasswordForBussinessEmail(process.env.BUSSINESS_EMAIL);
    if (!result.error) {
        const templateContent = readFileSync(join(__dirname, "..", "assets", "email_templates", "reject_add_store_request.ejs"), "utf-8");
        const compiledTemplate = compile(templateContent);
        const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate({ language });
        return new Promise((resolve, reject) => {
            transporterObj(result.data).sendMail({
                from: `Ubuyblues <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: "Reject The Store Addition Request At Ubuyblues",
                html: htmlContentAfterCompilingEjsTemplateFile,
            }, function (error, info) {
                if (error) reject(error);
                resolve({
                    msg: "Sending Reject Email On Store Process Has Been Successfully !!",
                    error: false,
                    data: {},
                });
            });
        });
    }
    return result;
}

async function sendConfirmRequestAddStoreArrivedEmail(email, language) {
    const result = await getPasswordForBussinessEmail(process.env.BUSSINESS_EMAIL);
    if (!result.error) {
        const templateContent = readFileSync(join(__dirname, "..", "assets", "email_templates", "confirm_request_add_store_arrived.ejs"), "utf-8");
        const compiledTemplate = compile(templateContent);
        const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate({ language });
        return new Promise((resolve, reject) => {
            transporterObj(result.data).sendMail({
                from: `Ubuyblues <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: "Confirmation Of Store Addition Request At Ubuyblues",
                html: htmlContentAfterCompilingEjsTemplateFile,
            }, function (error, info) {
                if (error) reject(error);
                resolve({
                    msg: "Sending Confirmation Of Store Addition Request At Ubuyblues Email Process Has Been Successfully !!",
                    error: false,
                    data: {},
                });
            });
        });
    }
    return result;
}

async function sendBlockStoreEmail(email, adminId, storeId, language) {
    const result = await getPasswordForBussinessEmail(process.env.BUSSINESS_EMAIL);
    if (!result.error) {
        const templateContent =  readFileSync(join(__dirname, "..", "assets", "email_templates", "block_store.ejs"), "utf-8");
        const compiledTemplate = compile(templateContent);
        const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate({ adminId, storeId, language });
        return new Promise((resolve, reject) => {
            transporterObj(result.data).sendMail({
                from: `Ubuyblues <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: "Block Store On Ubuyblues",
                html: htmlContentAfterCompilingEjsTemplateFile,
            }, function (error, info) {
                if (error) reject(error);
                resolve({
                    msg: "Sending Block Email The Store Process Has Been Successfully !!",
                    error: false,
                    data: {},
                });
            });
        });
    }
    return result;
}

async function sendDeleteStoreEmail(email, adminId, storeId, language) {
    const result = await getPasswordForBussinessEmail(process.env.BUSSINESS_EMAIL);
    if (!result.error) {
        const templateContent =  readFileSync(join(__dirname, "..", "assets", "email_templates", "delete_store.ejs"), "utf-8");
        const compiledTemplate = compile(templateContent);
        const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate({ adminId, storeId, language });
        return new Promise((resolve, reject) => {
            transporterObj(result.data).sendMail({
                from: `Ubuyblues <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: "Delete Store On Ubuyblues",
                html: htmlContentAfterCompilingEjsTemplateFile,
            }, function (error, info) {
                if (error) reject(error);
                resolve({
                    msg: "Sending Delete Email The Store Process Has Been Successfully !!",
                    error: false,
                    data: {},
                });
            });
        });
    }
    return result;
}

async function sendReceiveOrderEmail(email, orderDetails, language) {
    const result = await getPasswordForBussinessEmail(process.env.BUSSINESS_EMAIL);
    if (!result.error) {
        const templateContent =  readFileSync(join(__dirname, "..", "assets", "email_templates", "receive_order.ejs"), "utf-8");
        const compiledTemplate = compile(templateContent);
        const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate({ orderDetails, language });
        return new Promise((resolve, reject) => {
            transporterObj(result.data).sendMail({
                from: `Ubuyblues <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: "Receive Order On Ubuyblues",
                html: htmlContentAfterCompilingEjsTemplateFile,
            }, function (error, info) {
                if (error) reject(error);
                resolve({
                    msg: "Sending Receive Order Email On Ubuyblues Store Process Has Been Successfully !!",
                    error: false,
                    data: {},
                });
            });
        });
    }
    return result;
}

async function sendUpdateOrderEmail(email, newOrderDetails, language) {
    const result = await getPasswordForBussinessEmail(process.env.BUSSINESS_EMAIL);
    if (!result.error) {
        const templateContent =  readFileSync(join(__dirname, "..", "assets", "email_templates", `${newOrderDetails.status === "shipping" ? "order_in_shipping_status" : "order_shipped"}.ejs`), "utf-8");
        const compiledTemplate = compile(templateContent);
        const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate({ newOrderDetails, language });
        return new Promise((resolve, reject) => {
            transporterObj(result.data).sendMail({
                from: `Ubuyblues <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: newOrderDetails.status === "shipping" ? "Order In Shipping Now From Ubuyblues" : "Order Arrived From Ubuyblues",
                html: htmlContentAfterCompilingEjsTemplateFile,
            }, function (error, info) {
                if (error) reject(error);
                resolve({
                    msg: "Sending Receive Order Email On Ubuyblues Store Process Has Been Successfully !!",
                    error: false,
                    data: {},
                });
            });
        });
    }
    return result;
}

async function sendReceiveAddStoreRequestEmail(email, storeDetails) {
    const result = await getPasswordForBussinessEmail(process.env.BUSSINESS_EMAIL);
    if (!result.error) {
        const templateContent = readFileSync(join(__dirname, "..", "assets", "email_templates", "receive_add_store_request.ejs"), "utf-8");
        const compiledTemplate = compile(templateContent);
        const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate(storeDetails);
        return new Promise((resolve, reject) => {
            transporterObj(result.data).sendMail({
                from: `Ubuyblues <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: "Receive Add Store Request",
                html: htmlContentAfterCompilingEjsTemplateFile,
            }, function (error, info) {
                if (error) reject(error);
                resolve({
                    msg: "Sending Receive Add Store Request Email To Website Owner Process Has Been Successfully !!",
                    error: false,
                    data: {},
                });
            });
        });
    }
    return result;
}

async function sendChangePasswordEmail(email, language) {
    const result = await getPasswordForBussinessEmail(process.env.BUSSINESS_EMAIL);
    if (!result.error) {
        const templateContent = readFileSync(join(__dirname, "..", "assets", "email_templates", "change_password.ejs"), "utf-8");
        const compiledTemplate = compile(templateContent);
        const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate({ language });
        return new Promise((resolve, reject) => {
            transporterObj(result.data).sendMail({
                from: `Syria Sooq <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: "تغيير كلمة السر الخاصة بك في Syria Sooq",
                html: htmlContentAfterCompilingEjsTemplateFile,
            }, function (error, info) {
                if (error) reject(error);
                resolve({
                    msg: "Sending Change The User Password Email Process Has Been Successfully !!",
                    error: false,
                    data: {},
                });
            });
        });
    }
    return result;
}

function getResponseObject(msg, isError, data) {
    return {
        msg,
        error: isError,
        data,
    }
}

function checkIsExistValueForFieldsAndDataTypes(fieldNamesAndValuesAndDataTypes) {
    for (let fieldnameAndValueAndDataType of fieldNamesAndValuesAndDataTypes) {
        if (fieldnameAndValueAndDataType.isRequiredValue) {
            if (fieldnameAndValueAndDataType.dataType === "array") {
                if (Array.isArray(fieldnameAndValueAndDataType.fieldValue)){
                    if (fieldnameAndValueAndDataType.fieldValue.length === 0) {
                        return getResponseObject(
                            `Invalid Request, Please Send ${fieldnameAndValueAndDataType.fieldName} Value !!`,
                            true,
                            {}
                        );
                    }
                }
                else return getResponseObject(
                    `Invalid Request, Please Fix Type Of ${fieldnameAndValueAndDataType.fieldName} ( Required: ${fieldnameAndValueAndDataType.dataType} ) !!`,
                    true,
                    {}
                );
            }
            if (!fieldnameAndValueAndDataType.fieldValue) 
                return getResponseObject(
                    `Invalid Request, Please Send ${fieldnameAndValueAndDataType.fieldName} Value !!`,
                    true,
                    {}
                );
        }
        if (fieldnameAndValueAndDataType.fieldValue) {
            if (fieldnameAndValueAndDataType.dataType === "number" && isNaN(fieldnameAndValueAndDataType.fieldValue)) {
                return getResponseObject(
                    `Invalid Request, Please Fix Type Of ${fieldnameAndValueAndDataType.fieldName} ( Required: ${fieldnameAndValueAndDataType.dataType} ) !!`,
                    true,
                    {}
                );
            } 
            if (fieldnameAndValueAndDataType.dataType === "ObjectId" && !Types.ObjectId.isValid(fieldnameAndValueAndDataType.fieldValue))  {
                return getResponseObject(
                    `Invalid Request, Please Fix Type Of ${fieldnameAndValueAndDataType.fieldName} ( Required: ${fieldnameAndValueAndDataType.dataType} ) !!`,
                    true,
                    {}
                );
            }
            if (fieldnameAndValueAndDataType.dataType === "array" && !Array.isArray(fieldnameAndValueAndDataType.fieldValue))  {
                return getResponseObject(
                    `Invalid Request, Please Fix Type Of ${fieldnameAndValueAndDataType.fieldName} ( Required: ${fieldnameAndValueAndDataType.dataType} ) !!`,
                    true,
                    {}
                );
            }
            if (typeof fieldnameAndValueAndDataType.fieldValue !== fieldnameAndValueAndDataType.dataType && fieldnameAndValueAndDataType.dataType !== "ObjectId" && fieldnameAndValueAndDataType.dataType !== "array")
                return getResponseObject(
                    `Invalid Request, Please Fix Type Of ${fieldnameAndValueAndDataType.fieldName} ( Required: ${fieldnameAndValueAndDataType.dataType} ) !!`,
                    true,
                    {}
                );
        }
    }
    return getResponseObject("Success In Check Is Exist Value For Fields And Data Types !!", false, {});
}

function validateIsExistValueForFieldsAndDataTypes(fieldsDetails, res, nextFunc) {
    const checkResult = checkIsExistValueForFieldsAndDataTypes(fieldsDetails);
    if (checkResult.error) {
        res.status(400).json(checkResult);
        return;
    }
    nextFunc();
}

async function handleResizeImagesAndConvertFormatToWebp(files, outputImageFilePaths) {
    try{
        for(let i = 0; i < files.length; i++) {
            await sharp(files[i])
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
    catch(err) {
        throw err;
    }
}

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

function getSuitableTranslations(msg, language, variables = {}) {
    if (language) {
        switch(language) {
            case "ar": return processingTranslation(variables, arTranslations[msg] ? arTranslations[msg] : msg);
            default: return processingTranslation(variables, msg);
        }
    }
    return {
        en: processingTranslation(variables, msg),
        ar: processingTranslation(variables, arTranslations[msg] ? arTranslations[msg] : msg),
    }
}

module.exports = {
    isEmail,
    isValidPassword,
    isValidName,
    isValidMobilePhone,
    isValidLanguage,
    calcOrderAmount,
    sendVerificationCodeToUserEmail,
    sendCongratulationsOnCreatingNewAccountEmail,
    sendApproveStoreEmail,
    sendRejectStoreEmail,
    sendConfirmRequestAddStoreArrivedEmail,
    sendBlockStoreEmail,
    sendDeleteStoreEmail,
    sendReceiveOrderEmail,
    sendUpdateOrderEmail,
    sendReceiveAddStoreRequestEmail,
    sendChangePasswordEmail,
    getResponseObject,
    checkIsExistValueForFieldsAndDataTypes,
    validateIsExistValueForFieldsAndDataTypes,
    handleResizeImagesAndConvertFormatToWebp,
    getSuitableTranslations
}