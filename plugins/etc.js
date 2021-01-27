import Decimal from "decimal.js-light";

Decimal.set({
    precision: 20,
    rounding: Decimal.ROUND_FLOOR,
    toExpNeg: -10,
    toExpPos: 21,
})