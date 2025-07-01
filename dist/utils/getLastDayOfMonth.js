"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastDayOfMonth = void 0;
const getLastDayOfMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};
exports.getLastDayOfMonth = getLastDayOfMonth;
