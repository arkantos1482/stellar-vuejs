export const state = () => ({activeOffers: []})

export const mutations = {
    activeOffers: (state, payload) => {
        state.activeOffers = payload
    }
}

export const actions = {
    async refresh(context) {
        let offers = await this.$axios.$get('/offers')
        context.commit("activeOffers", offers)
    },
    async delete(context, payload) {
        await this.$axios.$post('/offers/delete', payload)
    }
}
