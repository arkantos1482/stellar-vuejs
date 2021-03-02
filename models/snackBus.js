export function error(msg) {
    $nuxt.$bus.$emit('snack', msg, 'error')
}

export function success(msg) {
    $nuxt.$bus.$emit('snack', msg, 'success')
}

export function normal(msg) {
    $nuxt.$bus.$emit('snack', msg, 'normal')
}