export const state = () => ({url: '', data: '', route: ''})

export const mutations = {
    set(state, payload) {
        state.url = payload.url
        state.data = payload.data
        state.route = payload.route
    },
    setEmail(state, payload) {
        state.data.email = payload
    }
}