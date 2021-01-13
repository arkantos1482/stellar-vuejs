import Decimal from "decimal.js-light";

export const toSeparated = (val) => val.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

export const safeDecimal = (val) => {
    try {
        return new Decimal(val)
    } catch (e) {
        return new Decimal(0)
    }
}