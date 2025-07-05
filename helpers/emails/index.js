const { join } = require("path");

const { readFileSync } = require("fs");

// Import EJS template processing function
const { compile } = require("ejs");

// Import module to generate verification codes
const CodeGenerator = require("node-code-generator");

const { getPasswordForBussinessEmail } = require("../../repositories/global_passwords");

const { emailsUtils } = require("../../utils");

async function sendVerificationCodeToUserEmail(email) {
    const result = await getPasswordForBussinessEmail(process.env.BUSSINESS_EMAIL);
    if (!result.error) {
        const generator = new CodeGenerator();
        const generatedCode = generator.generateCodes("####")[0];
        const templateContent = readFileSync(join(__dirname, "..", "assets", "email_templates", "email_template.ejs"), "utf-8");
        const compiledTemplate = compile(templateContent);
        const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate({ generatedCode });
        const mailConfigurations = {
            from: `${process.env.WEBSITE_NAME} <${process.env.BUSSINESS_EMAIL}>`,
            to: email,
            subject: `رمز التحقق من الحساب على <${process.env.BUSSINESS_EMAIL}>`,
            html: htmlContentAfterCompilingEjsTemplateFile,
        };
        return new Promise((resolve, reject) => {
            emailsUtils.getTransporter(result.data).sendMail(mailConfigurations, function (error, info) {
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
        const templateContent = readFileSync(join(__dirname, "..", "assets", "email_templates", "accept_add_store_request.ejs"), "utf-8");
        const compiledTemplate = compile(templateContent);
        const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate({ password, adminId, storeId, language });
        return new Promise((resolve, reject) => {
            emailsUtils.getTransporter(result.data).sendMail({
                from: `${process.env.WEBSITE_NAME} <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: `الموافقة على طلب إضافة متجر جديد لدى ${process.env.WEBSITE_NAME}`,
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
            emailsUtils.getTransporter(result.data).sendMail({
                from: `${process.env.WEBSITE_NAME} <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: `مرحباً بك في ${process.env.WEBSITE_NAME}`,
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
            emailsUtils.getTransporter(result.data).sendMail({
                from: `${process.env.WEBSITE_NAME} <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: `رفض طلب إضافة متجر جديد لدى ${process.env.WEBSITE_NAME}`,
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
            emailsUtils.getTransporter(result.data).sendMail({
                from: `${process.env.WEBSITE_NAME} <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: `تأكيد طلب إضافة متجر جديد لدى ${process.env.WEBSITE_NAME}`,
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
        const templateContent = readFileSync(join(__dirname, "..", "assets", "email_templates", "block_store.ejs"), "utf-8");
        const compiledTemplate = compile(templateContent);
        const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate({ adminId, storeId, language });
        return new Promise((resolve, reject) => {
            emailsUtils.getTransporter(result.data).sendMail({
                from: `${process.env.WEBSITE_NAME} <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: `حظر متجر في ${process.env.WEBSITE_NAME}`,
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
        const templateContent = readFileSync(join(__dirname, "..", "assets", "email_templates", "delete_store.ejs"), "utf-8");
        const compiledTemplate = compile(templateContent);
        const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate({ adminId, storeId, language });
        return new Promise((resolve, reject) => {
            emailsUtils.getTransporter(result.data).sendMail({
                from: `${process.env.WEBSITE_NAME} <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: `حذف متجر في ${process.env.WEBSITE_NAME}`,
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
        const templateContent = readFileSync(join(__dirname, "..", "assets", "email_templates", "receive_order.ejs"), "utf-8");
        const compiledTemplate = compile(templateContent);
        const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate({ orderDetails, language });
        return new Promise((resolve, reject) => {
            emailsUtils.getTransporter(result.data).sendMail({
                from: `${process.env.WEBSITE_NAME} <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: `Receive Order On ${process.env.WEBSITE_NAME}`,
                html: htmlContentAfterCompilingEjsTemplateFile,
            }, function (error, info) {
                if (error) reject(error);
                resolve({
                    msg: `Sending Receive Order Email On ${process.env.WEBSITE_NAME} Store Process Has Been Successfully !!`,
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
        const templateContent = readFileSync(join(__dirname, "..", "assets", "email_templates", `${newOrderDetails.status === "shipping" ? "order_in_shipping_status" : "order_shipped"}.ejs`), "utf-8");
        const compiledTemplate = compile(templateContent);
        const htmlContentAfterCompilingEjsTemplateFile = compiledTemplate({ newOrderDetails, language });
        return new Promise((resolve, reject) => {
            emailsUtils.getTransporter(result.data).sendMail({
                from: `${process.env.WEBSITE_NAME} <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: newOrderDetails.status === "shipping" ? `Order In Shipping Now From ${process.env.WEBSITE_NAME}` : `Order Arrived From ${process.env.WEBSITE_NAME}`,
                html: htmlContentAfterCompilingEjsTemplateFile,
            }, function (error, info) {
                if (error) reject(error);
                resolve({
                    msg: `Sending Receive Order Email On ${process.env.WEBSITE_NAME} Store Process Has Been Successfully !!`,
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
            emailsUtils.getTransporter(result.data).sendMail({
                from: `${process.env.WEBSITE_NAME} <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: `استقبال طلب إضافة متجر في ${process.env.WEBSITE_NAME}`,
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
            emailsUtils.getTransporter(result.data).sendMail({
                from: `${process.env.WEBSITE_NAME} <${process.env.BUSSINESS_EMAIL}>`,
                to: email,
                subject: `تغيير كلمة السر الخاصة بك في ${process.env.WEBSITE_NAME}`,
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

module.exports = {
    sendVerificationCodeToUserEmail,
    sendApproveStoreEmail,
    sendRejectStoreEmail,
    sendConfirmRequestAddStoreArrivedEmail,
    sendCongratulationsOnCreatingNewAccountEmail,
    sendBlockStoreEmail,
    sendDeleteStoreEmail,
    sendReceiveOrderEmail,
    sendUpdateOrderEmail,
    sendReceiveAddStoreRequestEmail,
    sendChangePasswordEmail
}