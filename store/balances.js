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
        let balances = (await this.$axios.$get('/profiles/me/balances')).balances
        let result = collect(balances)
            .map(item => {
                return {
                    [item.asset_code]: {
                        symbol: item.asset_code,
                        balance: new Decimal(item.balance),
                        selling_liabilities: new Decimal(item.selling_liabilities),
                        actual_balance: new Decimal(item.balance).minus(item.selling_liabilities)
                    }
                }
            })
            .reduce((_acc, item) => ({..._acc, ...item})) ?? []

        context.commit('set', result)
    }
}

