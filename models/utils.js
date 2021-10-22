import {coinToFarsi} from "~/models/coinList";

export function toIndexedList(list) {
    return list.map((item, index) => ({index: index + 1, ...item}))
}

export function toFarsiDate(val) {
    if (!val) return
    const utcDate = val.endsWith('Z') ? val : val + 'Z'
    const date = new Date(utcDate);
    return date.toLocaleTimeString('fa-IR') + ' ' + date.toLocaleDateString('fa-IR')
}

export function toFarsiCoinPair(pair) {
    let array = pair.split('/')
    let base = array[0].toUpperCase()
    let ctr = array[1].toUpperCase()
    return coinToFarsi[base] + '/' + coinToFarsi[ctr]
}

export function toFarsiCoin(type) {
    return coinToFarsi[type.toUpperCase()]
}