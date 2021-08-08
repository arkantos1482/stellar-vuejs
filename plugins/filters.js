import Vue from 'vue'
import {toSeparated} from "@/models/NumberUtil";
import {coinToFarsi, coinToImageAddress} from "~/models/coinList";

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

Vue.filter('toFarsiCoin', (type) => coinToFarsi[type.toUpperCase()])

Vue.filter('toFarsiCoinPair', (pair) => {
    let array = pair.split('/')
    let base = array[0].toUpperCase()
    let ctr = array[1].toUpperCase()
    return coinToFarsi[base] + '/' + coinToFarsi[ctr]
})

Vue.filter('toCoinIcon', (type) => coinToImageAddress[type.toUpperCase()])

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