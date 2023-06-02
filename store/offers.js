export const state = () => ({ activeOffers: [] })

export const mutations = {
  activeOffers: (state, payload) => {
    state.activeOffers = payload
  }
}

export const actions = {
  async refresh(context, userId = "me") {
    let offers = await this.$axios.$get("/offers/active/" + userId)
    context.commit("activeOffers", offers?.data ?? [])
  },
  async delete(context, payload) {
    await this.$axios.$post(`/orders/${payload.id}/cancel`)
    let offers = context.state.activeOffers.filter(
      item => parseInt(item.id) !== parseInt(payload.id)
    )
    context.commit("activeOffers", offers)
  }
}
