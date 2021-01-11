import Decimal from "decimal.js-light";

Decimal.set({
    precision: 20,
    rounding: Decimal.ROUND_HALF_UP,
    toExpNeg: -10,
    toExpPos: 21,
})