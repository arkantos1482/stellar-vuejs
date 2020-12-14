export const state = () => ({email: '', password: '', otp: ''})

export const mutations = {
    reset(state) {
        state.email = ''
        state.password = ''
        state.otp = ''
    },
    set(state, payload) {
        state.email = payload.email
        state.password = payload.password
        state.otp = payload.otp
    }
}
