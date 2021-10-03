import Vue from "vue";
import collect from "collect.js";

const state = Vue.observable({list: []})

export default () => state.list

export async function refresh(axios, user_id) {
    let arrayedAddress = await axios.$get(`/profiles/${user_id}/addresses`)
    state.list = collect(arrayedAddress)
        .map(item => ({[item.type]: item.address}))
        .reduce((_acc, item) => ({..._acc, ...item})) ?? []
}