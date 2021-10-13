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

//deprecated (replaced with internal functions)
export const getters = {
    shabaList(state) {
        return ['', '_2', '_3', '_4', '_5']
            .map(i => state.profile['bank_shaba' + i])
            .filter(i => i)
    },

    cardList(state) {
        return ['', '_2', '_3', '_4', '_5']
            .map(i => state.profile['bank_card' + i])
            .filter(i => i)
    }
}