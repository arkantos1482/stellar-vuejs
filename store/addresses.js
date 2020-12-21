import collect from "collect.js";

export const state = () => ({list: []})

export const mutations = {
    set(state, payload) {
        state.list = payload
    }
}

export const actions = {
    async refresh(context) {

        let arrayedAddress = await this.$axios.$get('/profiles/me/addresses')
        let keyValuedAddress = collect(arrayedAddress)
            .map(item => ({[item.type]: item.address}))
            .reduce((_acc, item) => ({..._acc, ...item})) ?? []
        context.commit('set', keyValuedAddress)
    }
}

