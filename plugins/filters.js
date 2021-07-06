import Vue from 'vue'
import {toSeparated} from "@/models/NumberUtil";

Vue.filter('prettyJson', (value) => {
    return JSON.stringify(value, null, 2)
})

Vue.filter('toFarsiDate', (val) => {
    if (!val) return
    const utcDate = val.endsWith('Z') ? val : val + 'Z'
    const date = new Date(utcDate);
    return date.toLocaleTimeString('fa-IR') + ' ' + date.toLocaleDateString('fa-IR')
})

Vue.filter('toFarsiJustDate', (val) => {
    if (!val) return
    const utcDate = val.endsWith('Z') ? val : val + 'Z'
    const date = new Date(utcDate);
    return date.toLocaleDateString('fa-IR')
})

Vue.filter('irtFix', (asset) => {
    return asset.replace('IRR', 'IRT')
})

const toFarsiCoin = (type) => {
    let typeUp = type.toUpperCase()
    const coins = {
        BTC: 'بیت کوین',
        LTC: 'لایت کوین',
        BCH: 'بیت کوین کش',
        AMN: 'امین',
        EBG: 'برگ',
        ETH: 'اتریوم',
        USDT: 'تتر',
        TRX: 'ترون',
        IRR: 'تومان',
        ZRK: 'زریک',
        TLS: 'تلاش',
        ART: 'آرت کوین',
        SHA: 'شکوفه آلو',
        WIT: 'وی توکن',
    }
    return coins[typeUp]
}

Vue.filter('toFarsiCoin', toFarsiCoin)

Vue.filter('toFarsiCoinPair', (pair) => {
    let array = pair.split('/')
    let filter = toFarsiCoin
    return filter(array[0]) + '/' + filter(array[1])
})

Vue.filter('toCoinIcon', (type) => {
    let typeUp = type.toUpperCase()

    let value = require('@/assets/images/AminToken.svg')
    if (typeUp === 'BTC') value = require('@/assets/images/BTC.svg')
    if (typeUp === 'LTC') value = require('@/assets/images/LTC.svg')
    if (typeUp === 'BCH') value = require('@/assets/images/Bch.svg')
    if (typeUp === 'AMN') value = require('@/assets/images/AminToken.svg')
    if (typeUp === 'EBG') value = require('@/assets/images/Barg.jpeg')
    if (typeUp === 'ART') value = require('@/assets/images/art_coin.jpeg')
    if (typeUp === 'ZRK') value = require('@/assets/images/zarik.png')
    if (typeUp === 'TLS') value = require('@/assets/images/TalashToken_end.png')
    if (typeUp === 'WIT') value = require('@/assets/images/we_token_3.png')
    if (typeUp === 'SHA') value = require('@/assets/images/shokofe_aloo_36.png')
    if (typeUp === 'ETH') value = require('@/assets/images/ETH.svg')
    if (typeUp === 'USDT') value = require('@/assets/images/USDT.svg')
    if (typeUp === 'TRX') value = require('@/assets/images/trx1.png')
    if (typeUp === 'IRR') value = require('@/assets/images/IRR.png')
    return value
})

Vue.filter('toFloat', (val) => {
    if (val) {
        return parseFloat(val).toString()
    } else if (parseFloat(val) === 0) {
        return '0'
    } else {
        return ''
    }
})

Vue.filter('separated', (val) => {
    return toSeparated(val)
})

Vue.filter('verifyToFarsi', (key) => {
    let dic = {
        email: 'ایمیل',
        cell_phone: 'موبایل',
        phone: 'تلفن ثابت',
        ssn: 'کارت ملی',
        address: 'آدرس',
        bank_card: 'کارت بانکی',
        bank_card_2: 'کارت بانکی دوم',
        bank_shaba: 'شبا',
        bank_shaba_2: 'شبای دوم',
        bank_account: 'اطلاعات هویتی'
    }
    return dic[key]
})

Vue.filter('toFa', (key) => {
    let dic = {
        withdraw: 'برداشت',
        deposit: 'واریز',
        pending: 'درجریان',
        failed: 'ناموفق',
        done: 'موفق',
        successful: 'موفق'
    }
    return dic[key.toLowerCase()] || key
})