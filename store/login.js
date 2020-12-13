export const state = () => ({email: '', password: ''})

export const mutations = {
    reset(state) {
        state.email = ''
        state.password = ''
    },
    set(state, payload) {
        state.email = payload.email
        state.password = payload.password
    }
}
