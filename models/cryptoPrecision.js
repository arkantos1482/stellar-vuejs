const currencies = {
    IRR: 0,
    USDT: 2
}

export function getDp(type) {
    if (currencies[type]) {
        return currencies[type]
    } else {
        return 6
    }
}