import collect from "collect.js";

export const state = () => ({balances: []})

export const mutations = {
    set(state, payload) {
        state.balances = payload
    }
}

export const actions = {
    async refresh(context) {
        let balances = (await this.$axios.$get('/profiles/me/stellar')).balances
        let result = collect(balances)
            .map(item => ({[item.asset_code]: item.balance}))
            .reduce((_acc, item) => ({..._acc, ...item})) ?? []

        context.commit('set', result)
    }
}

