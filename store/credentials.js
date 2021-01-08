export const state = () => ({email: '', password: '', otp: '', referral_code: ''})

export const mutations = {
    reset(state) {
        state.email = ''
        state.password = ''
        state.otp = ''
        state.referral_code = ''
    },
    set(state, payload) {
        state.email = payload.email
        state.password = payload.password
        state.otp = payload.otp
        state.referral_code = payload.referral_code
    }
}
