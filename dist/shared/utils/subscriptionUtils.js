"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpirationDate = void 0;
const getExpirationDate = (planType) => {
    const today = new Date();
    if (planType === 'monthly') {
        return new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    }
    else {
        return new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    }
};
exports.getExpirationDate = getExpirationDate;
//# sourceMappingURL=subscriptionUtils.js.map