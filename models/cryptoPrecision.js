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
    USDT: 2,

    DEFAULT: 6,
}

const markets = {
    TRX: {
        IRR: 2,
        USDT: 2,
        BTC: 7, // expected 8
        ETH: 7, // expected 8
        BNB: 7
    }
}

export function getDp(type) {
    let typeUp = type?.toUpperCase()

    if (currencies[typeUp] || currencies[typeUp] === 0) {
        return currencies[typeUp]
    } else {
        return currencies.DEFAULT
    }
}

export function getMarketDp(base, ctr) {
    let marketBase = markets[base]
    if (marketBase) {
        if (marketBase[ctr] || marketBase[ctr] === 0) {
            return marketBase[ctr]
        }
    }

    return getDp(ctr)
}