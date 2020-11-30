export default function ({$axios, store, redirect}) {
    $axios.onError(error => {
        if (error.response.status === 401) {
            console.log('401 handler !!')
            store.commit('auth/logout')
            redirect('/login')
        }
    })
}

