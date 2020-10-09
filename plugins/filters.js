import Vue from 'vue'

Vue.filter('prettyJson', (value) => {
    return JSON.stringify(value, null, 2)
})