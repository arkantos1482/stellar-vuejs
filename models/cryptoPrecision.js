const currencies = {
    IRR: 0,
    USDT: 2
}

export function getDp(type) {
    if (currencies[type] || currencies[type] === 0) {
        return currencies[type]
    } else {
        return 6
    }
}