const currencies = {
    IRR: 0,
    USDT: 2
}

export function getDp(type) {
    let typeUp = type?.toUpperCase()

    if (currencies[typeUp] || currencies[typeUp] === 0) {
        return currencies[typeUp]
    } else {
        return 6
    }
}