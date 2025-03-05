function validateStoreCategory(category, res, nextFunc, errorMsg = "Sorry, Please Send Valid Store Category !!") {
    const storeCategories = [
        "الإلكترونيات والتقنية",
        "الأزياء والملابس",
        "المنزل والمطبخ",
        "الجمال والعناية الشخصية",
        "الصحة والعافية",
        "الرياضة واللياقة البدنية",
        "الألعاب والهوايات",
        "الكتب والمجلات",
        "السيارات والمركبات",
        "البقالة والمواد الغذائية",
        "مستلزمات الأطفال والرضع",
        "مستلزمات الحيوانات الأليفة",
        "الأجهزة المنزلية",
        "الأدوات وتحسين المنزل",
        "الحديقة والهواء الطلق",
        "الصناعية والتجارية",
        "المستلزمات المكتبية والمدرسية",
        "الخدمات المهنية والإصلاحات",
        "الساعات والمجوهرات والإكسسوارات",
        "الموسيقى والفنون",
        "التعليم والدورات التدريبية",
        "الأجهزة الأمنية والمراقبة",
        "العقارات والتأجير",
        "الطاقة والأنظمة الشمسية",
        "الوظائف وفرص العمل",
        "المنتجات الفاخرة والماركات العالمية",
        "المنتجات المصنوعة يدويًا",
        "السفر والرحلات والمستلزمات السياحية",
    ];
    if (!storeCategories.includes(category)) {
        return res.status(400).json(getResponseObject(errorMsg, true, {}));
    }
    nextFunc();
}

module.exports = {
    validateStoreCategory,
}