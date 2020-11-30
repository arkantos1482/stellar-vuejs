export const state = () => ({isLoggedIn: false, profile: null})

export const mutations = {
    login(state) {
        state.isLoggedIn = true
    },
    logout(state) {
        state.isLoggedIn = false
    },
    profile(state, payload) {
        state.profile = payload
    }
}