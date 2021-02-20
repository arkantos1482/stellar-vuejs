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

Vue.filter('irtFix', (asset) => {
    return (asset === 'IRR') ? 'IRT' : asset
})

const toFarsiCoin = (type) => {
    let typeUp = type.toUpperCase()

    let value = typeUp
    if (typeUp === 'BTC') value = 'بیت کوین'
    if (typeUp === 'LTC') value = 'لایت کوین'
    if (typeUp === 'BCH') value = 'بیت کوین کش'
    if (typeUp === 'AMN') value = 'امین'
    if (typeUp === 'EBG') value = 'برگ'
    if (typeUp === 'ETH') value = 'اتریوم'
    if (typeUp === 'USDT') value = 'تتر'
    if (typeUp === 'IRR') value = 'تومان'
    return value
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
    if (typeUp === 'ETH') value = require('@/assets/images/ETH.svg')
    if (typeUp === 'USDT') value = require('@/assets/images/USDT.svg')
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
        bank_shaba: 'شبا',
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