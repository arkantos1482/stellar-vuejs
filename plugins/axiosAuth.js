export default function ({$axios, store, redirect, $bus}, inject) {

    const errorHandler = error => {
        if (error.response.data.error.msg?.my_node) {
            $bus.emit('snack', 'اشکالی رخ داده است.', 'error')
        } else {
            $bus.emit('snack', error.response.data.error.msg, 'error')
        }
    }

    const laxios = {
        get: async (loading, url, config) => {
            loading = true
            let res
            try {
                res = await $axios.get(url, config)
            } catch (error) {
                errorHandler(error)
            } finally {
                loading = false
            }
            return res
        },
        post: async (loading, url, data, config) => {
            loading = true
            let res
            try {
                res = await $axios.post(url, data, config)
            } catch (error) {
                errorHandler(error)
            } finally {
                loading = false
            }
            return res
        },
    }

    inject('laxios', laxios)

    $axios.onError(error => {
        if (error.response.status === 401) {
            console.log('401 handler !!')
            store.commit('auth/logout')
            redirect('/login')
        }
    })
}

