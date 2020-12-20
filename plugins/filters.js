import Vue from 'vue'

Vue.filter('prettyJson', (value) => {
    return JSON.stringify(value, null, 2)
})

Vue.filter('toFarsiCoin', (val) => {
    let value = val.toUpperCase()
    if (val === 'BTC') value = 'بیت کوین'
    if (val === 'LTC') value = 'لایت کوین'
    if (val === 'BCH') value = 'بیت کوین کش'
    if (val === 'AMIN') value = 'امین'
    if (val === 'BARG') value = 'برگ'
    if (val === 'ETH') value = 'اتریوم'
    if (val === 'USDT') value = 'تتر'
    if (val === 'IRR') value = 'ریال'
    return value
})