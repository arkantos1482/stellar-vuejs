const currencies = {
    AMN: 0,
    EBG: 0,
    DRC: 0,
    ZRK: 0,
    TLS: 0,
    ART: 0,
    SHA: 0,
    WIT: 0,

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