function calcOrderTotalPrices(products) {
    const totalPrices = {
        totalPriceBeforeDiscount: 0,
        totalDiscount: 0,
        totalPriceAfterDiscount: 0
    }
    for (let product of products) {
        totalPrices.totalPriceBeforeDiscount += product.unitPrice * product.quantity;
        totalPrices.totalDiscount += product.unitDiscount * product.quantity;
    }
    totalPrices.totalPriceAfterDiscount = totalPrices.totalPriceBeforeDiscount - totalPrices.totalDiscount;
    return totalPrices;
}

function calcReturnOrderTotalPrices(products) {
    const totalPrices = {
        approvedTotalPriceBeforeDiscount: 0,
        approvedTotalDiscount: 0,
        approvedTotalPriceAfterDiscount: 0
    }
    for (let product of products) {
        totalPrices.approvedTotalPriceBeforeDiscount += product.unitPrice * product.approvedQuantity;
        totalPrices.approvedTotalDiscount += product.unitDiscount * product.approvedQuantity;
    }
    totalPrices.approvedTotalPriceAfterDiscount = totalPrices.approvedTotalPriceBeforeDiscount - totalPrices.approvedTotalDiscount;
    return totalPrices;
}

module.exports = {
    calcOrderTotalPrices,
    calcReturnOrderTotalPrices,
}