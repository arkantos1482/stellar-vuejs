import collect from "collect.js";
import Decimal from "decimal.js-light";

export const state = () => ({list: []})

export const mutations = {
    set(state, payload) {
        state.list = payload
    }
}

export const actions = {
    async refresh(context) {
        let balances = (await this.$axios.$get('/profiles/me/stellar')).balances
        let result = collect(balances)
            .map(item => ({[item.asset_code]: new Decimal(item.balance).minus(item.selling_liabilities)}))
            .reduce((_acc, item) => ({..._acc, ...item})) ?? []

        context.commit('set', result)
    }
}

